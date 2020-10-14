import { BrowserView, Menu, app, shell, dialog, BrowserWindow, MenuItem } from 'electron';
import MainEventType from '../common/MainEventType';
import { MainProcess } from './main';

export default class AppMenu {
  constructor(mainProcess: MainProcess) {
    const mainWindow = mainProcess.mainWindow;
    const menu: Menu = new Menu();
    const fileMenu: MenuItem = new MenuItem({
      label: "行为树",
      submenu: [
        {
          label: "打开文件",
          accelerator: "Ctrl+O",
          click: () => {
            (async () => {
              const res = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [
                  { name: "Json", extensions: ['json'] }
                ]
              });
              mainWindow.webContents.send(MainEventType.OPEN_FILE, res.filePaths[0]);
            })();
          }
        },
        {
          label: "打开目录",
          accelerator: "Ctrl+Shift+O",
          click: () => {
            (async () => {
              const res = await dialog.showOpenDialog({
                properties: ['openDirectory']
              });
              if (res.filePaths.length > 0) {
                mainWindow.webContents.send(MainEventType.OPEN_WORKSPACE, res.filePaths[0]);
              }
            })();
          }
        },
        { type: 'separator' },
        {
          label: "最近打开",
          submenu: []
        },
        {
          label: "最近目录",
          submenu: [
            { label: "master" },
            { label: "分支0908" },
          ]
        },
        { type: 'separator' },
        {
          label: "关闭",
          click: () => {
            app.quit();
          }
        }
      ]
    });

    const toolsMenu: MenuItem = new MenuItem({
      label: "开发工具",
      submenu: [
        {
          label: "重载",
          accelerator: "Ctrl+R",
          click: (_, browserWindow) => {
            browserWindow.reload();
          }
        },
        {
          label: "打开控制台",
          accelerator: "Ctrl+Shift+I",
          click: (_, browserWindow) => {
            browserWindow.webContents.toggleDevTools();
          }
        }
      ]
    });

    menu.append(fileMenu);
    menu.append(toolsMenu);

    Menu.setApplicationMenu(menu);
  }
}