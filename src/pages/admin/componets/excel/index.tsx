import React from "react";

import { http, baseURL } from "src/http";
import moment, { Moment } from "moment";
import {
  Upload,
  message,
  Button,
  Icon,
  DatePicker,
  Spin,
  Row,
  Col
} from "antd";

export interface ExcelState {
  loading: boolean;
  day: string | undefined;
}

export class Excel extends React.Component<object, ExcelState> {
  public state = { loading: false, day: undefined };

  public export = () => {
    const { day } = this.state;
    this.setState({ loading: true });
    try {
      http.post("/export", { day }, { responseType: "blob" }).then(res => {
        if (res.data.code === 2) {
          alert("没有该天的数据");
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

  public onChange = (info: any) => {
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
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
    const { loading } = this.state;

    return (
      <Spin spinning={loading}>
        <Row>
          <Col span={12} style={{ textAlign: "center" }}>
            <Upload
              name="file"
              action={`${baseURL}/uploadExcel`}
              headers={{ authorization: "authorization-text" }}
              onChange={this.onChange}
              beforeUpload={this.beforeUpload}
            >
              <Button>
                <Icon type="upload" /> 上传excel文件
              </Button>
            </Upload>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <DatePicker
              onChange={this.onTimeChange}
              style={{ marginRight: 24 }}
            />
            <Button type="primary" onClick={this.export}>
              导出excel
            </Button>
          </Col>
        </Row>
      </Spin>
    );
  }
}
