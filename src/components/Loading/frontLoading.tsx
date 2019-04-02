import * as React from "react";
import { Toast } from "antd-mobile";
import { LoadingComponentProps } from "react-loadable";

export default class FrontLoading extends React.Component<
  LoadingComponentProps
> {
  public componentDidMount() {
    Toast.loading("稍等哦", 0);
  }

  public componentWillUnmount() {
    Toast.hide();
  }
  public render() {
    return <div>front</div>;
  }
}
