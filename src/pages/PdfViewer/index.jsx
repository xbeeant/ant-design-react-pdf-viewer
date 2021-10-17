import React, {useContext, useState} from 'react';
import {Viewer, Worker, classNames, TextDirection, ThemeContext, LocalizationContext} from '@react-pdf-viewer/core';
import zh_CN from '@react-pdf-viewer/locales/lib/zh_CN.json';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { MoreActionsPopover} from "./MoreActionsPopover";

import '@react-pdf-viewer/core/lib/styles/index.css';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const watermark = (props) => {
  const { mark, canvasLayer, scale, annotationLayer, textLayer } = props;
  return (
    <>
      {canvasLayer.children}
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.2)',
            fontSize: `${6 * scale}rem`,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            transform: 'rotate(-45deg)',
            userSelect: 'none',
          }}
        >
          {mark}
        </div>
      </div>
      {annotationLayer.children}
      {textLayer.children}
    </>
  )
};

const PdfViewer = () => {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  const { direction } = useContext(ThemeContext);
  const [l10n, setL10n] = React.useState(zh_CN);
  const localizationContext = { l10n, setL10n };
  // todo 自定义权限集
  const [permissions, setPermissions] = useState();

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.js">
      <LocalizationContext.Provider value={localizationContext}>
        <div
          style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            height: '100vh',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              backgroundColor: '#eeeeee',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <Toolbar>
              {(toolbarSlot) => {
                const isRtl = direction === TextDirection.RightToLeft;
                const {
                  CurrentPageInput,
                  Download,
                  EnterFullScreen,
                  GoToNextPage,
                  GoToPreviousPage,
                  NumberOfPages,
                  Print,
                  ShowSearchPopover,
                  SwitchTheme,
                  Zoom,
                  ZoomIn,
                  ZoomOut,
                } = toolbarSlot;

                return (
                  <div
                    data-testid="toolbar"
                    className={classNames({
                      'rpv-toolbar': true,
                      'rpv-toolbar--rtl': isRtl,
                    })}
                    role="toolbar"
                    aria-orientation="horizontal"
                  >
                    <div className="rpv-toolbar__left">
                      <div className="rpv-toolbar__item">
                        <ShowSearchPopover />
                      </div>
                      <div className="rpv-core__display--hidden rpv-core__display--block-small">
                        <div className="rpv-toolbar__item">
                          <GoToPreviousPage />
                        </div>
                      </div>
                      <div className="rpv-toolbar__item">
                        <CurrentPageInput />
                        <span className="rpv-toolbar__label">
                        / <NumberOfPages />
                    </span>
                      </div>
                      <div className="rpv-core__display--hidden rpv-core__display--block-small">
                        <div className="rpv-toolbar__item">
                          <GoToNextPage />
                        </div>
                      </div>
                    </div>
                    <div className="rpv-toolbar__center">
                      <div className="rpv-toolbar__item">
                        <ZoomOut />
                      </div>
                      <div className="rpv-core__display--hidden rpv-core__display--block-small">
                        <div className="rpv-toolbar__item">
                          <Zoom />
                        </div>
                      </div>
                      <div className="rpv-toolbar__item">
                        <ZoomIn />
                      </div>
                    </div>
                    <div className="rpv-toolbar__right">
                      <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className="rpv-toolbar__item">
                          <SwitchTheme />
                        </div>
                      </div>
                      <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className="rpv-toolbar__item">
                          <EnterFullScreen />
                        </div>
                      </div>
                      {
                        permissions?.download && (
                          <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                            <div className="rpv-toolbar__item">
                              <Download />
                            </div>
                          </div>
                        )
                      }
                      {
                        permissions?.print && (
                          <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                            <div className="rpv-toolbar__item">
                              <Print />
                            </div>
                          </div>
                        )}
                      <div className="rpv-toolbar__item">
                        <MoreActionsPopover toolbarSlot={toolbarSlot} permissions={{selective: false}} />
                      </div>
                    </div>
                  </div>
                );
              }}
            </Toolbar>
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              height: '100vh'
            }}
          >
            <Viewer
              renderPage={(props => watermark({...props, mark: 'Watermark Draft'}))}
              plugins={[toolbarPluginInstance]}
              fileUrl={`./test.pdf`}
            />
          </div>
        </div>
      </LocalizationContext.Provider>
    </Worker>
  )
}

export default PdfViewer;
