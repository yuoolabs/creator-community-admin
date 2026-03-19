import { Input, Select, Space } from 'antd'
import type { CSSProperties } from 'react'

type FilterSplitOption = {
  label: string
  value: string
}

type FilterSplitFieldProps = {
  options: FilterSplitOption[]
  typeValue: string
  onTypeChange: (value: string) => void
  inputValue: string
  onInputChange: (value: string) => void
  placeholder: string
  width?: CSSProperties['width']
}

export default function FilterSplitField({
  options,
  typeValue,
  onTypeChange,
  inputValue,
  onInputChange,
  placeholder,
  width = 420,
}: FilterSplitFieldProps) {
  return (
    <Space.Compact className="filter-split-field" style={{ width }}>
      <Select
        value={typeValue}
        onChange={onTypeChange}
        options={options}
        className="filter-split-select"
        showArrow={options.length > 1}
      />
      <Input
        value={inputValue}
        onChange={(event) => onInputChange(event.target.value)}
        placeholder={placeholder}
        className="filter-split-input"
        allowClear
      />
    </Space.Compact>
  )
}
