import * as React from 'react';
import { Editor as TinyMCEEditor} from '@tinymce/tinymce-react';
import {Editor} from 'tinymce/tinymce';


export interface ITinyMCEProps {
      parentUpdate: (v: string) => void;  

      scale: number;
      initialValue?: string;
      menubar: boolean | string;
      height: number;
      plugins: string;
      toolbar: string;
      content_style: string
      
}


export class TinyMCE_PCF extends React.Component<ITinyMCEProps> {

//public editorRef: Editor;

public handleFocusOut = (a: any, editor:Editor) => {
   this.props.parentUpdate(editor.getContent())
 }

  public render(): React.ReactNode {
    const k = (50 * (this.props.scale-1)).toFixed(2) + "%"
    const divStyle = {
      transform: 'translate('+k+', '+k+') scale('+this.props.scale+')' //+ ' translateY('+this.props.height *(this.props.scale-1)+')',

    }
    return (
      <div style={divStyle}>
     
            <TinyMCEEditor 
            apiKey='uv5i4e4e3nunqlmzpe5djtnfj50ajpdt3xl9diroe2yplj81'
            
            initialValue={this.props.initialValue}
            //onInit= {(evt, editor: Editor) => {this.editorRef = editor}}
            onFocusOut= {this.handleFocusOut}
            init={{
              
              height: this.props.height,
              menubar: this.props.menubar,
              plugins:  this.props. plugins,
/*
              menu: {
                file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
                edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                help: { title: 'Help', items: 'help' }
              },
              */
              toolbar: this.props.toolbar,
              content_style: this.props.content_style,
             
            }}
           
          />
        </div>
    )
  }
}

      /*
      <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={this.props.initialValue}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      */