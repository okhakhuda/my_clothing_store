import s from './ModalProduct.module.scss'

export const SizeSelector = ({ sizes, selectedSizes, onToggle }) => (
  <div className={s.formGroup}>
    <label className={s.label}>Доступні розміри</label>
    <div className={s.sizesGrid} role="group">
      {sizes.map(size => (
        <label key={size} className={s.sizeLabel}>
          <input
            type="checkbox"
            name="sizeList"
            value={size}
            checked={selectedSizes.includes(size)}
            onChange={() => onToggle(size)}
            className={s.sizeCheckbox}
          />
          <span className={s.sizeText}>{size}</span>
        </label>
      ))}
    </div>
  </div>
)
