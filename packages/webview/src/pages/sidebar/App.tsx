import { HashRouter, Route, Routes } from "react-router"
import { useEffect, useState } from "react"
import { ConfigProvider, ThemeConfig, theme as AntdTheme } from "antd";
import { useDove } from "../../hooks/use-dove";
import Home from "./views/home";
import ConfigNotFound from "./views/config-not-found"

function App() {
  const [theme, setTheme] = useState<ThemeConfig>();

  // 插件默认只支持两种主题：dark 与 light，根据 vscode 编辑器的背景色计算是哪种主题
  const computeTheme = () => {
    const vsCodeStyles = getComputedStyle(document.documentElement);
    const backgroundColor = vsCodeStyles.getPropertyValue('--vscode-editor-background').trim();
    const isDarkTheme = parseInt(backgroundColor.slice(1), 16) < 0x808080;
    setTheme({ algorithm: isDarkTheme ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm });
  }

  // 初始化通信
  useDove();

  useEffect(() => {
    computeTheme();
  }, []);

  return <ConfigProvider theme={theme}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ConfigNotFound />} />
      </Routes>
    </HashRouter>
  </ConfigProvider>
}

export default App
