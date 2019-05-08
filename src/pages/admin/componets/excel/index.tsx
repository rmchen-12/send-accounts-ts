import { Button, Col, DatePicker, Icon, message, Radio, Row, Spin, Upload } from 'antd';
import moment, { Moment } from 'moment';
import React from 'react';
import { baseURL, http } from 'src/http';

export interface ExcelState {
  loading: boolean;
  day: string | undefined;
  uploadType: string;
  exportType: string;
}

export class Excel extends React.Component<object, ExcelState> {
  public state = {
    loading: false,
    day: undefined,
    uploadType: "fight",
    exportType: "fight"
  };

  public export = () => {
    const { day, exportType } = this.state;
    this.setState({ loading: true });
    try {
      http
        .post("/export", { day, exportType }, { responseType: "blob" })
        .then(res => {
          if (res.data.code === 2) {
            message.error("没有该天的数据");
            return;
          }
          this.download(res.data, day);
          this.setState({ loading: false });
          message.success("导出成功");
        });
    } catch (error) {
      message.error(error);
      this.setState({ loading: false });
    }
  };

  public download = (data: Blob, day: ExcelState["day"]) => {
    if (!data) {
      return;
    }
    if (!day) {
      day = moment().format("YYYY-MM-DD");
    }

    const blob = new Blob([data], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    });
    const url = window.URL.createObjectURL(blob);
    const aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = url;
    aLink.setAttribute("download", `${day}.xlsx`);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); // 下载完成移除元素
    window.URL.revokeObjectURL(url); // 释放掉blob对象
  };

  public handleUpload = (info: any) => {
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  public handleRadioChange = (e: any) => {
    this.setState({ uploadType: e.target.value });
  };

  public handleExportChange = (e: any) => {
    this.setState({ exportType: e.target.value });
  };

  public onTimeChange = (date: Moment) => {
    this.setState({ day: date.format("YYYY-MM-DD") });
  };

  public beforeUpload = (file: any) => {
    if (/.*\.xlsx$/gi.test(file.name)) {
      return true;
    }
    message.info("选择excel文件上传");
    return false;
  };

  public render() {
    const { loading, uploadType } = this.state;

    return (
      <Spin spinning={loading}>
        <Row>
          <Col span={12} style={{ textAlign: "center" }}>
            <Upload
              name="file"
              action={`${baseURL}/uploadExcel?uploadType=${uploadType}`}
              headers={{ authorization: "authorization-text" }}
              onChange={this.handleUpload}
              beforeUpload={this.beforeUpload}
            >
              <Button>
                <Icon type="upload" /> 上传excel文件
              </Button>
            </Upload>
            <Radio.Group
              defaultValue="fight"
              buttonStyle="solid"
              style={{ marginTop: 20 }}
              onChange={this.handleRadioChange}
            >
              <Radio.Button value="fight">打榜</Radio.Button>
              <Radio.Button value="task">任务</Radio.Button>
            </Radio.Group>
          </Col>

          <Col span={12} style={{ textAlign: "center" }}>
            <DatePicker
              onChange={this.onTimeChange}
              style={{ marginRight: 24 }}
            />
            <Button type="primary" onClick={this.export}>
              导出excel
            </Button>

            <Radio.Group
              defaultValue="fight"
              buttonStyle="solid"
              style={{ display: "block", marginTop: 20 }}
              onChange={this.handleExportChange}
            >
              <Radio.Button value="fight">打榜</Radio.Button>
              <Radio.Button value="task">任务</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Spin>
    );
  }
}
