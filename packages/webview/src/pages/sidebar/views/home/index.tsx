import { useEffect, useState } from "react";
import { MsgType } from "shared";
import { useNavigate } from "react-router";
import { Spin, Tabs } from "antd";
import { TABS } from "../../utils/consts";
import { dove } from "../../../../hooks/use-dove";

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate= useNavigate();
  const tabs = [{
    key: TABS.AUTHORIZATION,
    label: '授权项目',
    children: '授权项目',
  }, {
    key: TABS.MY,
    label: '我的项目',
    children: '我的项目',
  }]

  // 检查配置文件是否存在
  const isConfigExists = async () => {
    const res = await dove.sendMessage(MsgType.IS_CONFIG_EXISTS);
    if (!res?.[0]) navigate('/config-not-found');
    setLoading(false);
  }

  useEffect(() => {
    isConfigExists();
  }, []);

  return !loading 
    ? <Tabs tabBarStyle={{ alignSelf: 'flex-start' }} defaultActiveKey={TABS.AUTHORIZATION} items={tabs} />
    : <Spin />
};

export default Home;