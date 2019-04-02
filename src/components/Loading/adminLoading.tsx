import * as React from "react";
import { LoadingComponentProps } from "react-loadable";

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
    return <div>admin</div>;
  }
}
