import * as React from "react";
import { LoadingComponentProps } from "react-loadable";
import { Spin } from "antd";

export interface AdminLoadingState {
  loading: boolean;
}

export default class AdminLoading extends React.Component<
  LoadingComponentProps,
  AdminLoadingState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true
    };
  }

  public componentDidMount() {
    this.setState({ loading: true });
  }

  public componentWillUnmount() {
    this.setState({ loading: false });
  }

  public render() {
    return (
      <Spin
        spinning={this.state.loading}
        style={{ marginTop: 250 }}
        size="large"
        tip="loading..."
      >
        <div style={{ width: "100vw", height: "100vh" }} />
      </Spin>
    );
  }
}
