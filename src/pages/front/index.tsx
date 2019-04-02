import * as React from "react";
import http from "../../http";
import { Toast } from "antd-mobile";
import ColorBall from "../../components/ColorBall";

export interface AdminState {
  readonly dataSource: object[];
  readonly nickName: string;
  readonly leaveAccount: number;
  readonly hasPassword: boolean;
  hasError: boolean;
  number: number;
  isImgLoad: boolean;
  showModal: boolean;
  disable: boolean;
  isCopy: boolean;
  colorBall: any;
  password: string;
}

export default class Front extends React.Component<object, AdminState> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataSource: [],
      nickName: "",
      leaveAccount: 0,
      hasPassword: false,
      hasError: false,
      number: 0,
      isImgLoad: false,
      showModal: false,
      disable: false,
      isCopy: false,
      colorBall: undefined,
      password: ""
    };
  }

  public componentDidMount() {
    Toast.loading("稍等哦", 0);
    this.getStat();
    this.handleIosBug();
    this.getBanner();
    const colorBall = new ColorBall({
      colors: ["#fdc0c8", "#fcedaa", "#90dfdc", "#eae0d5"]
    });
    this.setState({ colorBall });
  }

  public handleIosBug = () => {
    if (navigator.userAgent.toLocaleLowerCase().includes("iphone")) {
      // @ts-ignore
      this.intervalFlag = setInterval(() => {
        document.querySelector("body").scrollTop = 0;
      }, 200);
    }
  };

  public submit = () => {
    // tslint:disable-next-line:variable-name
    const { nickName, number, leaveAccount, password } = this.state;

    if (number > leaveAccount) {
      Toast.info("超过当前剩余量了哦");
      this.setState({ hasError: true });
      return;
    }
    if (nickName && number) {
      this.fetchAccount(nickName, number, password);
    } else {
      Toast.info("信息填完哦");
    }
  };

  public getStat = () => {
    http
      .get("/getStat")
      .then(
        (res: {
          data: { data: { leaveAccountNumber: any; hasPassword: any } };
        }) => {
          const { leaveAccountNumber, hasPassword } = res.data.data;
          this.setState({ leaveAccount: leaveAccountNumber, hasPassword });
          if (this.state.isImgLoad) {
            Toast.hide();
          }
        }
      )
      .catch((err: any) => {
        Toast.hide();
        Toast.fail("网络错误，请联系管理员哦");
      });
  };

  public getBanner = () => {
    http
      .get("/getBanner")
      .then(res => {
        this.setState({ banner: res.data.data });
      })
      .catch(err => {
        Toast.hide();
        Toast.fail("网络错误，请联系管理员哦");
      });
  };

  public fetchAccount = (nickName, number, password) => {
    Toast.loading("稍等哦", 0);
    http
      .post("/getData", { nickName, number, password })
      .then(res => {
        if (res.data.code === 1) {
          Toast.hide();
          Toast.info("口令有误哦,重新输入口令吧");
          return;
        }
        Toast.hide();
        this.setState({
          dataSource: res.data.data,
          showModal: true,
          disabled: true
        });
      })
      .catch(err => {
        Toast.hide();
        Toast.fail("网络错误，请联系管理员哦");
      });
  };

  public onIdChange = value => {
    this.setState({ nickName: value });
  };

  public onNumberChange = value => {
    const { leaveAccount } = this.state;
    const inputValue = Number(value.replace(/\s/g, ""));
    if (!/\d+/gi.test(inputValue)) {
      Toast.info(
        leaveAccount <= 100 ? `输入1-${leaveAccount}的整数` : "输入1-100的整数"
      );
    } else if (inputValue <= (leaveAccount <= 100 ? leaveAccount : 100)) {
      this.setState({
        hasError: false
      });
    } else {
      this.setState({
        hasError: true
      });
      Toast.info(
        leaveAccount <= 100 ? `最多只能领${leaveAccount}个` : `最多只能领100个`
      );
    }

    this.setState({
      number: value
    });
  };

  public onPasswordChange = value => {
    this.setState({ password: value });
  };

  public imgLoad = () => {
    this.setState({ isImgLoad: true });
    Toast.hide();
  };

  public onWrapTouchStart = e => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, ".am-modal-content");
    if (!pNode) {
      e.preventDefault();
    }
  };

  public handleTouchStart = e => {
    this.state.colorBall.fly(e.touches[0].pageX, e.touches[0].pageY);
  };

  public render() {
    return <div>front</div>;
  }
}
