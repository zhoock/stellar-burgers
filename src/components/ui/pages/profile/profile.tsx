import { FC } from 'react';

import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';

import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
}) => (
  <main className={`${commonStyles.container}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>

    <form
      className={`mt-30 ${styles.form} ${commonStyles.form}`}
      onSubmit={handleSubmit}
    >
      <>
        <div className='pb-6'>
          <Input
            placeholder='Имя'
            name='name'
            value={formValue.name}
            onChange={handleInputChange}
            icon='EditIcon'
            // заглушки, чтобы TS не ругался в этой версии типов
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>

        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            name='email'
            value={formValue.email}
            onChange={handleInputChange}
            icon='EditIcon'
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>

        <div className='pb-6'>
          <Input
            type='password'
            placeholder='Пароль'
            name='password'
            value={formValue.password}
            onChange={handleInputChange}
            icon='EditIcon'
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>

        {isFormChanged && (
          <div className={styles.button}>
            <Button
              type='secondary'
              htmlType='button'
              size='medium'
              onClick={handleCancel}
            >
              Отменить
            </Button>
            <Button type='primary' size='medium' htmlType='submit'>
              Сохранить
            </Button>
          </div>
        )}

        {updateUserError && (
          <p
            className={`${commonStyles.error} pt-5 text text_type_main-default`}
          >
            {updateUserError}
          </p>
        )}
      </>
    </form>
  </main>
);
