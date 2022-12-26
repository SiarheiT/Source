import * as React from 'react';
import  {useState} from 'react';
import {EditorState}  from 'draft-js';
import { ContentState, convertToRaw, convertFromHTML} from 'draft-js';
import {IDraftEditorProps} from './DraftEditor'

export const DraftEditorWithStateHOC = (Component: any) => {

  // eslint-disable-next-line react/display-name
  return (props: IDraftEditorProps) => {

        const blocksFromHTML = convertFromHTML('<p>text</p>');
        const state = ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap,
                    );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editorState, setEditorState] = useState(() => 
                EditorState.createEmpty() // createWithContent(state)
        ,);
        const updateTextDescription = async (state: EditorState) => {

            await setEditorState(state);
            
            const data = convertToRaw(editorState.getCurrentContent());
                props.parentUpdate("data.getPlainText()")
            
            };

    return <Component editorState={editorState} onEditorStateChange={updateTextDescription} {...props} />;
  };
};