import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Layout, Menu, Icon } from "antd";
import { Excel } from "./componets/excel";
import { Img } from "./componets/img";
import { Password } from "./componets/password";
import { Stat } from "./componets/stat";

const { Header, Content, Footer, Sider } = Layout;

export interface AdminState {
  selectMenu: string;
}

class Admin extends React.Component<RouteComponentProps, AdminState> {
  public state = {
    selectMenu: "stat"
  };

  public menuChange = (value: { key: string }) => {
    this.setState({ selectMenu: value.key });
  };

  public renderContent = () => {
    const { selectMenu } = this.state;
    const components = {
      stat: <Stat />,
      excel: <Excel />,
      img: <Img />,
      password: <Password />
    };
    console.log(components[selectMenu]);

    return components[selectMenu];
  };

  public toFront = () => {
    this.props.history.push("/");
  };

  public render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div
            style={{
              fontSize: 10,
              color: "#fff",
              margin: "20px 0 20px 24px",
              cursor: "pointer"
            }}
            onClick={this.toFront}
          >
            <span style={{ fontFamily: "arial" }}>&reg;</span>
            <span>粉色系爱農超话站</span>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["stat"]}
            onSelect={this.menuChange}
          >
            <Menu.Item key="stat">
              <Icon type="bar-chart" />
              <span className="nav-text">数据统计</span>
            </Menu.Item>
            <Menu.Item key="excel">
              <Icon type="file-excel" />
              <span className="nav-text">excel</span>
            </Menu.Item>
            <Menu.Item key="img">
              <Icon type="picture" />
              <span className="nav-text">上传帅图</span>
            </Menu.Item>
            <Menu.Item key="password">
              <Icon type="robot" />
              <span className="nav-text">口令设置</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: "#fff",
              padding: 0
            }}
          />
          <Content
            style={{
              margin: "24px 16px 0",
              height: "100vh"
            }}
          >
            <div
              style={{
                padding: 24,
                background: "#fff",
                height: "100%"
              }}
            >
              {this.renderContent()}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>Created by rmchen</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Admin);
