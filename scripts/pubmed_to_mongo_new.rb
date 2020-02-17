# Parse Pubmed XML files directly into Mongo docs without bothering with JSON conversion
require 'nokogiri'
require 'mongo'
require 'json'
require 'benchmark'

class CitationParser < Nokogiri::XML::SAX::Document
  ############ SET THESE TO DEBUG ############
  # NOT YET IMPLEMENTED -- good idea but too ambitious for now
  #   @@debug = true  # if set, print the original article citation and the result after processing
  #   @@stop_after_article = 1 # Number of articles to process before stopping
  #  # @@stop_after_file = 1     # Number of files to process before stopping
  #   @@articles_to_print = []  # Print the citation and post-process record for specific article PMIDs
  #   @@elements_to_print = []
  # IMPLEMENTED:
  @@print_result = false   # If set, print the post-process record
  @@no_mongo = false   # if set, skip the save to Mongo
  @@show_tags_and_content = false   # if set, show each opening tag, content, and closing tag as parsed
  ############################################

  # We need the parser to pull out the relevant fields that we want to retain
  # for each article in the index
  # Currently:
  #   1. ids (esp doi)
  #   2. journal title
  #   3. article title
  #   4. publication date
  #   5. abstract
  #   6. subjects [could be mesh headings or keywords]
  #   7. authors
  #   8. journal issue (volume and issue number)

  def start_document
    @processed_articles = []
    @text = ''

    # Set up connection to Mongo DB and articles collection
    Mongo::Logger.logger.level = Logger::ERROR # (https://stackoverflow.com/questions/30292100/how-can-i-disable-mongodb-log-messages-in-console)
    @client = Mongo::Client.new([ 'localhost:27017' ], :database => 'pubmed')
    @collection = @client[:articles]
    @file_collection = @client[:processed_files]
  end



  def start_element(element, attrs)
    puts "opened tag: #{element}" if @@show_tags_and_content

    case element
    when 'PubmedArticle'
      # Start of article -- begin with a clean data structure
      @article = {
        :article_ids => {},         # PubMed ID, DOI, etc
        :authors => [],
        :pubDate => {},
        :issue => {},
        :subjects => []     # MESH headings and keywords
      }
    when 'ArticleId'
      # id_type can be :pubmed, :doi, etc.
      @id_type = attrs[0][1].to_sym
    when 'ReferenceList'
      # We don't care about references, and their <ArticleIdList>s get confused
      # with those of the actual article
      @ignore_children = true
    when 'PubDate'
      @in_pub_date = true 
      @pub_date = {}
    when 'Author'
      @in_author = true
      @author = {}
    when 'Title'
      # This is *journal* title, not article title
      @in_journal_title = true
      @journal_title = ''
    when 'MeshHeading'
      @in_mesh_heading = true
      @mesh_descriptor = nil
      @mesh_qualifiers = []
    when 'ArticleTitle', 'Abstract'
      # These are the 'parent tags' of concern, as they're the ones that sometimes have <sup>
      # and <sub> tags in them. When that happens, the text gets fragmented and has to be
      # processed as an array, paying special attention to the parent and child tags so
      # nothing gets lost.
      @parent_tag_parts = []
    when 'sup', 'sub'
      # 'sup' and 'sub' require special handling -- they're HTML embedded in the XML text fields,
      # usually in <ArticleTitle> or <AbstractText>, but Nokogiri doesn't seem to know the difference
      # and treats them as new XML tags, confusing matters.
      @parent_tag_parts << @text.strip!
      @text = ''
    end
  end



  def characters(str)
    @text += str
  end



  def end_element(element)
    @text.strip!

    if @@show_tags_and_content
      puts "content: #{@text}"
      puts "closed tag: #{element}"
    end

    # End of article
    if element == 'PubmedArticle'
      #@article[:sourceFile] = f
      @processed_articles << @article
      puts "Post-process record: #{JSON.pretty_generate(@article)}" if @@print_result
      # exit
    end

    # Main tag handling logic
    case element
    when 'ArticleId'
      @article[:article_ids][@id_type] = @text
    when 'Title'
      # This is *journal* title
      @article[:journal] = @text
    when 'Volume'
      @article[:issue][:volume] = @text 
    when 'Issue'
      @article[:issue][:issue] = @text
    when 'Year'
      @pub_date[:year] = @text if @in_pub_date
    when 'Month'
      @pub_date[:month] = @text if @in_pub_date
    when 'Day'
      @pub_date[:day] = @text if @in_pub_date
    when 'PubDate'
      if @in_pub_date
        @article[:pubDate] = @pub_date
        @in_pub_date = false
      end
    when 'ForeName'
      @author[:forename] = @text if @in_author
    when 'LastName'
      @author[:lastname] = @text if @in_author
    when 'Author'
      if @in_author
        author = nil
        if @author[:lastname]
          author = @author[:lastname]
          if @author[:forename]
            author += ", #{@author[:forename]}"
          end
        end
        @article[:authors] << author unless author.nil?
        @in_author = false  
      end  
    when 'sup', 'sub'
      @parent_tag_parts << "<#{element}>#{@text}</#{element}>"
    when 'ArticleTitle'
      @parent_tag_parts << @text
      @article[:title] = @parent_tag_parts.join(' ')
      #puts "Final #{element}: " + @parent_tag_parts.join(' ')
    when 'AbstractText'
      @parent_tag_parts << @text
    when 'Abstract'
      @article[:abstract] = @parent_tag_parts.join(' ')
      #puts "Final #{element}: " + @parent_tag_parts.join(' ')
    when 'Keyword'
      @article[:subjects] << @text
    when 'DescriptorName'
      @mesh_descriptor = @text if @in_mesh_heading
    when 'QualifierName'
      @mesh_qualifiers << @text if @in_mesh_heading
    when 'MeshHeading'
      if @in_mesh_heading
        if @mesh_qualifiers.length > 0
          @mesh_qualifiers.each do |mq|
            mq.strip!
            @article[:subjects] << "#{@mesh_descriptor} -- #{mq}"
          end
        else
          @article[:subjects] << @mesh_descriptor
        end
        @in_mesh_heading = false
        @mesh_qualifiers = []
        @mesh_descriptor = nil
      end
    when 'ReferenceList'
      @ignore_children = false
    end

    @text = ''
  end


  def end_document
    puts "Done! Processed #{@processed_articles.count} articles"
    # Add to Mongo
    if !@@no_mongo
      result = @collection.insert_many(@processed_articles)
      puts "Inserted #{result.inserted_count} records into Mongo DB"
    else
      puts "Skipping Mongo insert as directed"
    end
  end

end

# Main program
parser = Nokogiri::XML::SAX::Parser.new(CitationParser.new)
if ARGV[0]
  # PRocess the single file specified
  files = [ARGV[0]]
else
  files = Dir['source_files/originals/*']
end
files.each do |f|
  puts "Processing #{f}"
  puts Benchmark.measure {
    parser.parse_file f
  }
end

# Save list of processed files to Mongo
Mongo::Logger.logger.level = Logger::ERROR # (https://stackoverflow.com/questions/30292100/how-can-i-disable-mongodb-log-messages-in-console)
@client = Mongo::Client.new([ 'localhost:27017' ], :database => 'pubmed')
@collection = @client[:processed_files]
processed_files = files.map { |f| { :filename => File.basename(f) } }
@collection.insert_many(processed_files)
puts "\nDone with everything!\n\n"