import React, { Fragment } from 'react';

const FirstDocuments = ({index}) => {
 // const docs = index.documentStore.docs;
 // const numDocsToShow = Math.min(10, index.documentStore.length);

  // The document store in the index is set up as a hash in the form:
  // {
  //    id1: { document 1}
  //    id2: { document 2}
  //    ...
  //  }
  //  This means we have to handle the (unknown) keys to traverse the structure
 // let keyArray = Object.keys(docs);

  return (
    <Fragment>
      {/* <h4>First {numDocsToShow} articles in index</h4>
      <ul>
        { keyArray.map(k => <li key={k}><span data-id={k}>{docs[k].title}</span></li>) }
      </ul> */}
    </Fragment>
  );
}

export default FirstDocuments;
