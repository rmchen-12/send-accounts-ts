import * as React from "react";

export interface AdminState {
  selectMenu: string;
}

export default class Admin extends React.Component<AdminState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public render() {
    return <div>admin</div>;
  }
}
