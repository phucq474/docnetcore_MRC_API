import React from 'react';
import TopMenu from './../TopMenu';
import { getLogin } from './../../Utils/Helpler';
import { ScrollTop } from 'primereact/scrolltop';
const isLogin = getLogin();

const MainLayout = (props) => {
  return (
    <div key='divMainLayout'>
      {isLogin === null || isLogin.id === 0 ? null : <TopMenu {...props} />}
      {props.children}
      <ScrollTop />
    </div>
  );
}
export default MainLayout;