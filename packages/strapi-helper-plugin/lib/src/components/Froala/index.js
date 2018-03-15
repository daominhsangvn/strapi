/**
 *
 * Wysiwyg
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty, replace, trimStart, trimEnd} from 'lodash';
import cn from 'classnames';
import auth from 'utils/auth';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

import request from 'utils/request';

import styles from './styles.scss';

/* eslint-disable  react/no-string-refs */ // NOTE: need to check eslint
/* eslint-disable react/jsx-handler-names */
class Froala extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: '',
      config: {
        placeholderText: props.placeholder,
        heightMin: 350,
        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'clearFormatting', '|', 'print', 'spellChecker', 'html', '|', 'undo', 'redo'],
        imageUpload: true,
        imageUploadMethod: 'POST',
        imageUploadParam: 'files',
        imageUploadURL: `${strapi.backendURL}/upload`,

        fileUpload: true,
        fileUploadMethod: 'POST',
        fileUploadParam: 'files',
        fileUploadURL: `${strapi.backendURL}/upload`,

        requestHeaders: {
          'X-Forwarded-Host': 'strapi',
          'Authorization': 'Bearer ' + auth.getToken()
        },
        events: {
          'froalaEditor.image.uploaded': (e, editor, response) => {
            const imageUrl = JSON.parse(response)[0].url;
            editor.image.insert(imageUrl, false, null, editor.image.get(), {link: imageUrl});
            return false;
          },
          'froalaEditor.file.uploaded': (e, editor, response) => {
            const result = JSON.parse(response)[0];
            const fileUrl = result.url;
            const fileName = result.name;
            editor.image.insert(fileUrl, fileName, {link: fileUrl});
            return false;
          }
        }
      }
    };
  }

  componentDidMount() {
    // if (this.props.autoFocus) {
    //   this.focus();
    // }

    if (!isEmpty(this.props.value)) {
      this.setState({model: this.props.value});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && !this.state.hasInitialValue) {
      this.setState({model: nextProps.value});
    }
  }

  handleModelChange = (model) => {
    this.setState({ model });

    this.props.onChange({
      target: {
        value: model,
        name: this.props.name,
        type: 'textarea',
      }
    });
  };

  render() {
    const { model, config } = this.state;
    return (
      <div
        className={cn(
          styles.editorWrapper,
        )}
      >
        <div className={styles.editorWrapper}>
          <FroalaEditor
            tag='textarea'
            config={config}
            model={model}
            onModelChange={this.handleModelChange}
          />
        </div>
      </div>
    );
  }
}

// NOTE: handle defaultProps!
Froala.defaultProps = {
  onChange: () => {
  },
  value: '',
};

Froala.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default Froala;
