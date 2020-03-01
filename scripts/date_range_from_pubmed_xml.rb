# Given a PubMed abstract index XML file, get the range of years
# covered by the article citations
require 'nokogiri'

class CitationParser < Nokogiri::XML::SAX::Document


  def initialize(filename)
    @filename = filename
  end

  def start_document
    @text = ''
    @years = []
    @in_pub_date = false
    @capture = false
  end

  def start_element(element, attrs)
    case element
    when 'PubDate'
      @in_pub_date = true
    when 'Year'
      @capture = @in_pub_date
    end
  end

  def characters(str)
    @text += str if @capture
  end

  def end_element(element)
    case element
    when 'Year'
      if @capture
        @years << Integer(@text)
        @text = ''
        @capture = false
      end
    when 'PubDate'
      @in_pub_date = false
    end
  end

  def end_document
    #puts "Range found: #{@years.min}-#{@years.max} for #{@filename} (avg: #{mean(@years)}, mode: #{mode(@years)}, median: #{median(@years)})"
    year_report = " ("
    categories(@years).each do |k, v|
      year_report += "#{k}: #{v}, "
    end
    year_report += ")"
    puts "Range found: #{@years.min}-#{@years.max} for #{@filename}" + year_report
  end

  def mean(years)
    @years.reduce(:+) / @years.count
  end

  def median(years)
    sorted = years.sort
    if years.count % 2 == 0
      0.5 * (sorted[years.length / 2 - 1] + sorted[years.length / 2])
    else
      sorted[years.length / 2]
    end
  end

  def mode(years)
    frequencies = years.reduce(Hash.new(0)) { |h,v| h[v] += 1; h }
    years.max_by { |y| frequencies[y] }
  end

  def categories(years)
    {
      :early => years.select { |y| y < 1960 }.count,
      :_1960s => years.select { |y| y >= 1960 && y < 1970 }.count,
      :_1970s => years.select { |y| y >= 1970 && y < 1980 }.count,
      :_1980s => years.select { |y| y >= 1980 && y < 1990 }.count,
      :_1990s => years.select { |y| y >= 1990 && y < 2000 }.count,
      :_2000s => years.select { |y| y >= 2000 && y < 2010 }.count,
      :_2010s => years.select { |y| y >= 2010 }.count,
    }
  end
end


# Main program
if ARGV[0]
  # PRocess the single file specified
  files = [ARGV[0]]
else
  files = Dir['source_files/originals/*']
end
puts "\n\nWorking..."
files.sort.each do |f|
  parser = Nokogiri::XML::SAX::Parser.new(CitationParser.new(File.basename(f)))
  #puts "Processing #{f}"
  parser.parse_file f
end
puts "\nDone\n\n"