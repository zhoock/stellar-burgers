import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();
  const isConstructor =
    pathname === '/' || pathname.startsWith('/ingredients/');
  const isFeed = pathname.startsWith('/feed');
  const isProfile =
    pathname.startsWith('/login') || pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={`${styles.link} ${isConstructor ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructor ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to='/feed'
            className={`${styles.link} ${isFeed ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeed ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo className='' />
        </div>

        <NavLink
          to='/profile'
          className={`${styles.link_position_last} ${styles.link} ${isProfile ? styles.link_active : ''}`}
        >
          <ProfileIcon type={isProfile ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
