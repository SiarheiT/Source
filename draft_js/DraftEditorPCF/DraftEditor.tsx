import * as React from 'react';
import  {useState} from 'react';
import {EditorState}  from 'draft-js';
import { ContentState, convertToRaw, convertFromHTML} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';


import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export interface IDraftEditorProps {
 // editorState: EditorState;
 // setEditorState: (state: EditorState) => void;
    parentUpdate: (v: string) => void;  

    scale: number;
    initialValue: string;
    width: number;
    height: number;
}

export class DraftEditor extends React.Component<IDraftEditorProps, {editorState: EditorState}> {

  //public editorState =  () =>  EditorState.createEmpty();
  //public  setEditorState = (state: EditorState) => {this.editorState = () => state};
 private onChange: (state: EditorState) => void
 private parentUpdate: (v: string) => void;  
 private convertOptions: any;

  constructor(props: IDraftEditorProps) {
    super(props);

   const blocksFromHTML = convertFromHTML(props.initialValue);

     const state = ContentState.createFromBlockArray(
       blocksFromHTML.contentBlocks,
       blocksFromHTML.entityMap,
     ); 
     this.state = {editorState:  EditorState.createWithContent(state)};

    /*  this.convertOptions = {
        defaultBlockTag: 'div',
        inlineStyleFn: (styles: any) => {
          let key = 'color-';
          let color = styles.filter((value: string) => value.startsWith(key)).first();
       
          if (color) {
            return {
              element: 'span',
              style: {
                color: color.replace(key, ''),
              },
            };
          }
        }, 
      };
    */

    this.parentUpdate = props.parentUpdate;

    this.onChange = editorState => {
      this.setState({editorState: editorState})

      this.parentUpdate(stateToHTML(editorState.getCurrentContent())) //, this.convertOptions))
    };
  }

  componentDidUpdate(prevProps: IDraftEditorProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.initialValue !== prevProps.initialValue) {
      //use options
      const blocksFromHTML = convertFromHTML(this.props.initialValue);

       if(blocksFromHTML != undefined){
          const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
          ); 
          this.setState({editorState:  EditorState.createWithContent(state)})
       }else {
        this.setState({editorState:  EditorState.createEmpty()})
       }
    }
  }


  public render(): React.ReactNode {


    const k = (50 * (this.props.scale-1)).toFixed(2) + "%"
    const divStyle = {
      transform: 'translate('+k+', '+k+') scale('+this.props.scale+')', //+ ' translateY('+this.props.height *(this.props.scale-1)+')',
      width: this.props.width +"px",
      height: this.props.height+"px",
    }

    return (
      <div className="App" style={divStyle}>


      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onChange}
        toolbar={{
          //options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          options: ['blockType', 'link',   'emoji', 'inline',  'remove', 'list', 'history'],
          inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],

          },
          list: { inDropdown: false },
          link: { inDropdown: false },
          history: { inDropdown: false },
        }}
      //  toolbar={{
      //    options: ['inline', 'blockAlign']
      //  }}
      />
      <a className='draftjsref' href='https://draftjs.org/' title='draftjs.org' target='_blank' rel="noreferrer">Powered by draft-js</a>
    </div>
    )
  }
}


