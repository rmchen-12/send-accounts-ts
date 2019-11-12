import React, { PureComponent } from "react";

import { http } from "src/http";
import { message, Button, Spin, Input } from "antd";

interface PasswordState {
  loading: boolean;
  password: string;
}

export class Password extends PureComponent<object, PasswordState> {
  public state = { loading: false, password: "" };

  public componentDidMount() {
    this.getPassword();
  }

  public getPassword = () => {
    try {
      http.get("/getPassword").then(res => {
        this.setState({ password: res.data.data });
      });
    } catch (error) {
      alert("出错了");
    }
  };

  public onsubmit = () => {
    const { password } = this.state;
    this.setState({ loading: true });
    try {
      http.post("/updatePassWord", { password }).then(res => {
        message.success("更新口令成功");
        this.setState({ loading: false });
      });
    } catch (error) {
      message.error(error);
      this.setState({ loading: false });
    }
  };

  public onChange = (e: any) => {
    this.setState({ password: e.target.value });
  };

  public render() {
    const { loading, password } = this.state;

    return (
      <Spin spinning={loading}>
        <Input
          placeholder="输入口令"
          onChange={this.onChange}
          value={password}
          style={{ width: 200, marginRight: 24 }}
        />
        <Button type="primary" onClick={this.onsubmit}>
          更新口令
        </Button>
      </Spin>
    );
  }
}
