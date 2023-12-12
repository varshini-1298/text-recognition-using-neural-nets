
import React, { Component } from "react";
import cookie from "react-cookies";
import { googleTranslate } from "./utils/googleTranslate";

class App extends Component {
  state = {
    languageCodes: [],
    language: cookie.load("language") ? cookie.load("language") : "en",
    question: cookie.load("question") ? cookie.load("question") : "Which language do you want to study?"
  };

  componentDidMount() {
    googleTranslate.getSupportedLanguages("en", function(err, languageCodes) {
      getLanguageCodes(languageCodes);
    });

    const getLanguageCodes = languageCodes => {
      this.setState({ languageCodes });
    };
  }

  render() {
    const { languageCodes, language, question } = this.state;

    return (
      <div style={this.divStyle}>
        <p>{question}</p>

        <select
          className="select-language"
          value={language}
          onChange={e => this.changeHandler(e.target.value)}
        >
          {languageCodes.map(lang => (
            <option key={lang.language} value={lang.language}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  changeHandler = language => {
    let { question } = this.state;
    let cookieLanguage = cookie.load("language");
    let transQuestion = "";

    const translating = transQuestion => {
      if (question !== transQuestion) {
        this.setState({ question: transQuestion });
        cookie.save("question", transQuestion, { path: "/" });
      }
    };

    // translate the question when selecting a different language
    if (language !== cookieLanguage) {
      googleTranslate.translate(question, language, function(err, translation) {
        transQuestion = translation.translatedText;
        translating(transQuestion);
      });
    }

    this.setState({ language });
    cookie.save("language", language, { path: "/" });
  };

  // just some inline css to center our demo
  divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100wh"
  };
}

export default App;

