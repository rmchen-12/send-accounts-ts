import { Col, Radio, Row, Spin } from 'antd';
import Echarts from 'echarts-for-react';
import React, { PureComponent } from 'react';
import { http } from 'src/http';

interface CountData {
  name: string;
  count: number;
}

interface StatState {
  leaveAccountNumber: number;
  totalNumber: number;
  todaySendNumber: number;
  todayTotalNumber: number;
  countData: CountData[];
  loading: boolean;
  type: string;
}

export class Stat extends PureComponent<object, StatState> {
  public state = {
    leaveAccountNumber: 0,
    totalNumber: 0,
    todaySendNumber: 0,
    todayTotalNumber: 0,
    countData: [],
    loading: false,
    type: "fight"
  };

  public componentDidMount() {
    this.getStat();
  }

  public getStat = () => {
    const { type } = this.state;
    this.setState({ loading: true });
    http
      .post("/getStat", { type })
      .then(res => {
        const {
          leaveAccountNumber,
          countDTO,
          totalNumber,
          todaySendNumber,
          todayTotalNumber
        } = res.data.data;
        this.setState({
          leaveAccountNumber,
          todaySendNumber,
          todayTotalNumber,
          countData: countDTO.sort(
            (pre: CountData, current: CountData) => current.count - pre.count
          ),
          totalNumber
        });
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  public handleTypeChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.getStat();
    });
  };

  public render() {
    const {
      leaveAccountNumber,
      totalNumber,
      todayTotalNumber,
      todaySendNumber,
      loading
    } = this.state;

    return (
      <Spin spinning={loading}>
        <Radio.Group
          defaultValue="fight"
          buttonStyle="solid"
          onChange={this.handleTypeChange}
          style={{ marginBottom: 20 }}
        >
          <Radio.Button value="fight">打榜</Radio.Button>
          <Radio.Button value="task">任务</Radio.Button>
        </Radio.Group>
        <Row
          align="middle"
          justify="space-around"
          type="flex"
          style={{ marginBottom: 16 }}
        >
          <Col span={4} style={{ textAlign: "center", fontSize: 20 }}>
            总投放：{totalNumber}
          </Col>
          <Col span={4} style={{ textAlign: "center", fontSize: 20 }}>
            总已领：{totalNumber - leaveAccountNumber}
          </Col>
          <Col span={4} style={{ textAlign: "center", fontSize: 20 }}>
            当天投放：{todayTotalNumber}
          </Col>
          <Col span={4} style={{ textAlign: "center", fontSize: 20 }}>
            当天领取：{todaySendNumber}
          </Col>
          <Col span={4} style={{ textAlign: "center", fontSize: 20 }}>
            总剩余：{leaveAccountNumber}
          </Col>
        </Row>
        <Echarts
          option={this.getOptions()}
          style={{ width: "100%", height: "75vh" }}
        />
      </Spin>
    );
  }

  private getOptions = () => {
    const { countData } = this.state;
    return {
      color: ["#3aa1ff"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "#3aa1ff",
            opacity: 0.1
          }
        },
        textStyle: {
          color: "#000"
        },
        padding: 10,
        backgroundColor: "rgba(255,255,255,.9)"
      },
      legend: {
        data: "合计"
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#e9e9e9"
          }
        }
      },
      xAxis: {
        type: "category",
        splitLine: { show: false },
        axisLabel: {
          interval: 0,
          rotate: -45
        },
        data: countData.map((v: CountData) => v.name)
      },
      series: [
        {
          name: "合计",
          type: "bar",
          label: {
            normal: {
              show: true,
              position: "inside"
            }
          },
          data: countData.map((v: CountData) => v.count)
        }
      ]
    };
  };
}
