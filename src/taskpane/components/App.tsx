import * as React from "react";
import { Button, ButtonType } from "office-ui-fabric-react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
import * as getFile from './GetXlsFile.js'

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  isLoading: Boolean,
  processedFilePath: String,
  isError: Boolean
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      isLoading: false,
      processedFilePath: "",
      isError: false
    };
    this.click = this.click.bind(this)
  }

  buildFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    return fileSelector;
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration"
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality"
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro"
        }
      ]
    });
  }

  click = async () => {
    try {
      await Excel.run(async context => {
        context.workbook.save()
        this.setState({isLoading: true})
        getFile.getDocumentAsCompressed((err, response) => {
          if (err != null) {
            this.setState({isLoading: false, isError: true})
          } else {
            this.setState({isLoading: false, isError: false, processedFilePath: response})
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { title, isOfficeInitialized } = this.props;
    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-welcome">
      <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
      <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
        <p className="ms-font-l">
          Modify the source files, then click <b>Run</b>.
        </p>
    {this.state.processedFilePath != "" ? <p>Processed File Path: {this.state.processedFilePath}</p> : <div></div>}
    {this.state.isError ? <p>Error processing your file..</p> : <div></div>}
        {this.state.isLoading ? <p>Please wait. Processing your file..</p> : 
          <Button
          className="ms-welcome__action"
          buttonType={ButtonType.hero}
          iconProps={{ iconName: "ChevronRight" }}
          onClick={this.click}>
          Run
        </Button>}
      </HeroList>
    </div>
    );
  }

}
