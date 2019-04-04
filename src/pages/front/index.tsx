import * as React from "react";
import { http } from "../../http";
import { InputItem, Toast, Button, Modal } from "antd-mobile";
// import ColorBall from "../../components/ColorBall";
import copy from "copy-to-clipboard";
import "./App.css";

interface Data {
  data: string;
}

export interface AdminState {
  dataSource: Data[];
  nickName: string;
  leaveAccount: number;
  hasPassword: boolean;
  hasError: boolean;
  amount: number | undefined;
  isImgLoad: boolean;
  showModal: boolean;
  disable: boolean;
  isCopy: boolean;
  // colorBall: colorBall | undefined;
  password: string;
  banner: string;
}

export default class Front extends React.Component<object, AdminState> {
  public readonly state = {
    dataSource: [],
    nickName: "",
    leaveAccount: 0,
    hasPassword: false,
    hasError: false,
    amount: undefined,
    isImgLoad: false,
    showModal: false,
    disable: false,
    isCopy: false,
    // colorBall: undefined,
    password: "",
    banner: ""
  };

  private tip: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidMount() {
    Toast.loading("稍等哦", 0);
    this.getStat();
    this.handleIosBug();
    this.getBanner();
    // const colorBall = new ColorBall({
    //   colors: ["#fdc0c8", "#fcedaa", "#90dfdc", "#eae0d5"]
    // });
    // this.setState({ colorBall });
  }

  public handleIosBug = () => {
    if (navigator.userAgent.toLocaleLowerCase().includes("iphone")) {
      // @ts-ignore
      this.intervalFlag = setInterval(() => {
        (document.querySelector("body") as HTMLBodyElement).scrollTop = 0;
      }, 200);
    }
  };

  public submit = () => {
    const {
      nickName,
      amount,
      leaveAccount,
      password,
      hasPassword
    } = this.state;

    if (Number(amount) > leaveAccount) {
      Toast.info("超过当前剩余量了哦");
      this.setState({ hasError: true });
      return;
    }
    if (hasPassword) {
      nickName && amount && password
        ? this.fetchAccount(nickName, amount, password)
        : Toast.info("信息填完哦");
    } else {
      nickName && amount
        ? this.fetchAccount(nickName, amount)
        : Toast.info("信息填完哦");
    }
  };

  public getStat = () => {
    http
      .get("/getStat")
      .then(
        (res: {
          data: {
            data: {
              leaveAccountNumber: any;
              hasPassword: any;
            };
          };
        }) => {
          const { leaveAccountNumber, hasPassword } = res.data.data;
          this.setState({
            leaveAccount: leaveAccountNumber,
            hasPassword
          });
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

  public fetchAccount = (
    nickName: AdminState["nickName"],
    amount: AdminState["amount"],
    password?: AdminState["password"]
  ) => {
    Toast.loading("稍等哦", 0);
    http
      .post("/getData", {
        nickName,
        amount,
        password
      })
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
          disable: true
        });
      })
      .catch(err => {
        Toast.hide();
        Toast.fail("网络错误，请联系管理员哦");
      });
  };

  public onIdChange = (value: AdminState["nickName"]) => {
    this.setState({ nickName: value });
  };

  public onAmountChange = (value: string) => {
    const { leaveAccount } = this.state;

    if (Number(value) <= (leaveAccount <= 100 ? leaveAccount : 100)) {
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
      amount: Number(value)
    });
  };

  public onPasswordChange = (value: AdminState["password"]) => {
    this.setState({ password: value });
  };

  public imgLoad = () => {
    this.setState({ isImgLoad: true });
    Toast.hide();
  };

  public onWrapTouchStart = (e: any) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = this.closest(e.target, ".am-modal-content");
    if (!pNode) {
      e.preventDefault();
    }
  };

  public handleTouchStart = (e: any) => {
    // this.state.colorBall.fly(e.touches[0].pageX, e.touches[0].pageY);
  };

  public closeModal = () => {
    this.setState({ showModal: false });
  };

  public render() {
    const {
      nickName,
      amount,
      leaveAccount,
      dataSource,
      password,
      hasPassword,
      isImgLoad,
      showModal,
      disable,
      isCopy,
      banner
    } = this.state;
    return (
      <div>
        <div className="App" style={{ opacity: isImgLoad ? 1 : 0 }}>
          <img
            src={
              process.env.NODE_ENV === "development"
                ? `http://localhost:8080/${banner}`
                : `${window.location.origin}/${banner}`
            }
            alt="banner"
            width="100%"
            height="auto"
            onLoad={this.imgLoad}
          />
          <div className="input-wrapper">
            <InputItem
              placeholder="输入你的微博ID"
              onChange={this.onIdChange}
              value={nickName}
            >
              id
            </InputItem>
            <InputItem
              type="digit"
              placeholder={
                leaveAccount <= 100
                  ? `输入领取数量，库存${leaveAccount}个`
                  : "输入领取数量，最多领100个哦"
              }
              error={this.state.hasError}
              onChange={this.onAmountChange}
              value={amount === 0 ? undefined : String(amount)}
            >
              数量
            </InputItem>
            {hasPassword ? (
              <InputItem
                type="password"
                placeholder="输入口令"
                onChange={this.onPasswordChange}
                value={password}
              >
                口令
              </InputItem>
            ) : (
              ""
            )}
          </div>
          <div className="list-wrapper" onTouchStart={this.handleTouchStart}>
            <div className="tip-wrapper" ref={this.tip}>
              <span style={{ fontFamily: "arial" }}>&reg;</span>
              <span>粉色系爱農超话站</span>
            </div>
          </div>

          <Button
            type={"primary"}
            style={{
              backgroundColor: "rgb(252, 177, 247)"
            }}
            disabled={disable}
            onClick={this.submit}
          >
            {disable ? "领取成功，糖糖辛苦了：）" : "领取"}
          </Button>

          <Modal
            visible={showModal}
            transparent={true}
            maskClosable={false}
            onClose={this.closeModal}
            footer={[
              {
                text: isCopy ? "去粘贴到记事本吧：)" : "点击复制",
                onPress: () => {
                  copy(
                    dataSource
                      .map((v: Data) => v.data.replace(/^,/gi, ""))
                      .join("\n")
                  );
                  this.setState({ isCopy: true });
                  setTimeout(() => {
                    this.setState({
                      showModal: false
                    });
                  }, 3000);
                }
              }
            ]}
            wrapProps={{
              onTouchStart: this.onWrapTouchStart
            }}
          >
            <div
              style={{
                height: 100,
                overflow: "scroll"
              }}
            >
              {dataSource.map((v: Data, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                  {v.data.replace(/^,/gi, "")}
                </p>
              ))}
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  private closest = (el: HTMLElement, selector: string) => {
    const matchesSelector = el.matches || el.webkitMatchesSelector;

    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement as HTMLElement;
    }
    return null;
  };
}
