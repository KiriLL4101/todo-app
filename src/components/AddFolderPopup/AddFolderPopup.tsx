import React, { useState } from 'react'
import classNames from 'classnames'

import Badge from '../../common/Badge/Badge'
import Field from '../../common/Field/Field'
import Button from '../../common/Button/Button'
import useStore from '../../store/store.context'
import { createNewFolder, requestFolderList } from '../../api/folderService'
import useToast from '../../package/Toaster/Toaster.context'
import type { Color } from '../App'

import CloseIcon from 'icon:../../assets/img/close.svg'

import * as styles from './AddFolderPopup.module.css'

interface AddFolderPopupProps {
  onClose: () => void
}

const AddFolderPopup: React.FC<AddFolderPopupProps> = ({ onClose }) => {
  const { colors, setFolders } = useStore()
  const [selectedColorId, setSelectedColorId] = useState<Color['id']>(
    colors[0]?.id
  )
  const [nameFolder, setNameFolder] = useState<string>('')

  const toaster = useToast()

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFolder(e.target.value)
  }

  const onClickColorId = (id: number) => {
    setSelectedColorId(id)
  }

  const addFolder = async () => {
    if (nameFolder && selectedColorId) {
      const newFolder = await createNewFolder({
        name: nameFolder,
        colorId: selectedColorId,
      }).catch(() => {
        toaster({
          type: 'danger',
          message: 'Ошибка создания папки',
        })
      })

      if (newFolder) {
        await requestFolderList().then(data => {
          setFolders(data)
          onClose()
        })
      }
    }
  }

  return (
    <div className={styles.popup}>
      <CloseIcon className={styles.close} onClick={() => onClose()} />
      <Field
        type={'text'}
        placeholder={'Название папки'}
        onChange={onChangeField}
        value={nameFolder}
      />
      <div className={styles.colorsWrapper}>
        {colors.length > 0 &&
          colors.map(color => (
            <Badge
              key={color.id}
              color={color.name}
              className={classNames({
                [styles.active]: selectedColorId === color.id,
              })}
              onClick={() => onClickColorId(color.id)}
            />
          ))}
      </div>
      <Button onClick={() => addFolder()}>Добавить</Button>
    </div>
  )
}

export default AddFolderPopup
