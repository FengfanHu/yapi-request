import { HashRouter, Route, Routes, Link } from "react-router"
import ConfigNotFound from "./views/config-not-found"
import { useEffect, useState } from "react"
import { ConfigProvider, ThemeConfig, theme as AntdTheme } from "antd";
import { useDove } from "../../hooks/use-dove";

function App() {
  const [theme, setTheme] = useState<ThemeConfig>();

  // 初始化通信
  useDove();

  // 插件默认只支持两种主题：dark 与 light，根据 vscode 编辑器的背景色计算是哪种主题
  useEffect(() => {
    const vsCodeStyles = getComputedStyle(document.documentElement);
    const backgroundColor = vsCodeStyles.getPropertyValue('--vscode-editor-background').trim();
    const isDarkTheme = parseInt(backgroundColor.slice(1), 16) < 0x808080;
    setTheme({ algorithm: isDarkTheme ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm });
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <HashRouter>
          <Link to="/">Home</Link>
          <Link to="/config">123</Link>
          <Routes>
            <Route path="/" element={<div>SiderBar</div>} />
            <Route path="*" element={<ConfigNotFound />} />
          </Routes>
      </HashRouter>
    </ConfigProvider>
  )
}

export default App
