import { Button, Icon, message, Spin, Upload } from 'antd';
import React from 'react';
import { http } from 'src/http';

interface ImgState {
  loading: boolean;
  banner: string;
}

export class Img extends React.PureComponent<object, ImgState> {
  public state = { loading: false, banner: "" };

  public componentDidMount() {
    this.getBanner();
  }

  public onChange = (info: any) => {
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      this.getBanner();
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  public getBanner = () => {
    http
      .get("/getBanner")
      .then(res => {
        this.setState({ banner: res.data.data });
      })
      .catch(err => {
        message.error(err);
      });
  };

  public render() {
    const { loading, banner } = this.state;

    return (
      <Spin spinning={loading}>
        <Upload
          name="file"
          action={
            process.env.NODE_ENV === "production"
              ? "http://49.233.175.175:8080/uploadImg"
              : "http://localhost:8080/uploadImg"
          }
          onChange={this.onChange}
        >
          <Button>
            <Icon type="upload" /> 上传图片
          </Button>
        </Upload>
        <img
          src={
            process.env.NODE_ENV === "development"
              ? `http://localhost:8080/${banner}`
              : `${window.location.origin}/${banner}`
          }
          alt="banner"
          width="400px"
          height="auto"
          style={{ marginTop: 24 }}
        />
      </Spin>
    );
  }
}
