import { Button, Empty } from "antd";

const ConfigNotFound = () => {
  return (
    <Empty
      description="检测到当前项目不存在配置文件"
    >
      <Button>生成配置文件</Button>
    </Empty>
  )
};

export default ConfigNotFound;