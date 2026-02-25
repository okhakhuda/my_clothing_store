'use client'

import React, { useState, useEffect } from 'react'
import s from './DeliverySelection.module.scss'

const DeliverySelection = ({ onDeliverySelected }) => {
  const [selectedProvider, setSelectedProvider] = useState('novaPoshta')
  const [regions, setRegions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Завантаження областей в залежності від обраного постачальника
  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let data
        if (selectedProvider === 'novaPoshta') {
          const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: process.env.NEXT_PUBLIC_NOVAPOST_API_KEY,
              modelName: 'Address',
              calledMethod: 'getAreas',
              methodProperties: {},
            }),
          })
          data = await response.json()
          setRegions(
            data.data.map(region => ({
              id: region.Ref,
              name: region.Description,
            })),
          )
        } else if (selectedProvider === 'ukrPoshta') {
          // API Укрпошти (якщо доступне)
          const response = await fetch('https://ukrposhta.ua/address-classifier/api/regions')
          data = await response.json()
          setRegions(
            data.map(region => ({
              id: region.id,
              name: region.name,
            })),
          )
        }
      } catch (err) {
        setError('Не вдалося завантажити області')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegions()
    setSelectedRegion('')
    setCities([])
    setSelectedCity('')
    setDepartments([])
    setSelectedDepartment('')
  }, [selectedProvider])

  // Завантаження міст при виборі області (аналогічно для обох провайдерів)
  useEffect(() => {
    if (!selectedRegion) return

    const fetchCities = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let data
        if (selectedProvider === 'novaPoshta') {
          const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: process.env.NEXT_PUBLIC_NOVAPOST_API_KEY,
              modelName: 'Address',
              calledMethod: 'getCities',
              methodProperties: {
                AreaRef: selectedRegion,
              },
            }),
          })
          data = await response.json()
          setCities(
            data.data.map(city => ({
              id: city.Ref,
              name: city.Description,
            })),
          )
        } else if (selectedProvider === 'ukrPoshta') {
          const response = await fetch(`https://ukrposhta.ua/address-classifier/api/region/${selectedRegion}/cities`)
          data = await response.json()
          setCities(
            data.map(city => ({
              id: city.id,
              name: city.name,
            })),
          )
        }
      } catch (err) {
        setError('Не вдалося завантажити міста')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
    setSelectedCity('')
    setDepartments([])
    setSelectedDepartment('')
  }, [selectedRegion, selectedProvider])

  // Завантаження відділень при виборі міста
  useEffect(() => {
    if (!selectedCity) return

    const fetchDepartments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let data
        if (selectedProvider === 'novaPoshta') {
          const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: process.env.NEXT_PUBLIC_NOVAPOST_API_KEY,
              modelName: 'AddressGeneral',
              calledMethod: 'getWarehouses',
              methodProperties: {
                CityRef: selectedCity,
              },
            }),
          })
          data = await response.json()
          setDepartments(
            data.data.map(dep => ({
              id: dep.Ref,
              name: dep.Description,
            })),
          )
        } else if (selectedProvider === 'ukrPoshta') {
          const response = await fetch(`https://ukrposhta.ua/address-classifier/api/city/${selectedCity}/departments`)
          data = await response.json()
          setDepartments(
            data.map(dep => ({
              id: dep.id,
              name: dep.name,
            })),
          )
        }
      } catch (err) {
        setError('Не вдалося завантажити відділення')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
    setSelectedDepartment('')
  }, [selectedCity, selectedProvider])

  // Відправка даних про доставку
  useEffect(() => {
    if (selectedDepartment) {
      const selectedRegionObj = regions.find(r => r.id === selectedRegion)
      const selectedCityObj = cities.find(c => c.id === selectedCity)
      const selectedDepartmentObj = departments.find(d => d.id === selectedDepartment)

      onDeliverySelected({
        provider: selectedProvider === 'novaPoshta' ? 'Нова Пошта' : 'Укрпошта',
        region: selectedRegionObj?.name || '',
        city: selectedCityObj?.name || '',
        department: selectedDepartmentObj?.name || '',
        departmentId: selectedDepartment,
      })
    }
  }, [
    selectedDepartment,
    selectedProvider,
    selectedRegion,
    selectedCity,
    regions,
    cities,
    departments,
    onDeliverySelected,
  ])

  const handleProviderChange = provider => {
    setSelectedProvider(provider)
  }

  const handleRegionChange = e => {
    setSelectedRegion(e.target.value)
    setCities([])
    setDepartments([])
    setSelectedCity('')
    setSelectedDepartment('')
  }

  const handleCityChange = e => {
    setSelectedCity(e.target.value)
    setDepartments([])
    setSelectedDepartment('')
  }

  const handleDepartmentChange = e => {
    setSelectedDepartment(e.target.value)
  }

  return (
    <div className={s.deliveryWrapper}>
      <div className={s.deliveryContainer}>
        <h3 className={s.deliveryTitle}>Вибір доставки</h3>

        <div className={s.providerSelection}>
          <div className={s.providerOptions}>
            <div className={s.providerOption}>
              <input
                type="radio"
                id="novaPoshta"
                name="deliveryProvider"
                value="novaPoshta"
                className={s.providerInput}
                checked={selectedProvider === 'novaPoshta'}
                onChange={() => handleProviderChange('novaPoshta')}
              />
              <label htmlFor="novaPoshta" className={s.providerLabel}>
                <div className={s.providerIcon}>🚚</div>
                <div className={s.providerContent}>
                  <div className={s.providerName}>Нова Пошта</div>
                  <div className={s.providerDesc}>Швидка доставка по всій Україні</div>
                </div>
              </label>
            </div>

            <div className={s.providerOption}>
              <input
                type="radio"
                id="ukrPoshta"
                name="deliveryProvider"
                value="ukrPoshta"
                className={s.providerInput}
                checked={selectedProvider === 'ukrPoshta'}
                onChange={() => handleProviderChange('ukrPoshta')}
              />
              <label htmlFor="ukrPoshta" className={s.providerLabel}>
                <div className={s.providerIcon}>📮</div>
                <div className={s.providerContent}>
                  <div className={s.providerName}>Укрпошта</div>
                  <div className={s.providerDesc}>Доступна доставка до відділень</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className={s.loadingContainer}>
            <div className={s.loadingSpinner}></div>
            <p className={s.loadingText}>Завантаження даних...</p>
          </div>
        )}

        {error && (
          <div className={s.errorContainer}>
            <div className={s.errorIcon}>⚠️</div>
            <p className={s.errorText}>{error}</p>
            <button className={s.errorRetryBtn} onClick={() => window.location.reload()}>
              Спробувати ще раз
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className={s.selectionFields}>
            <div className={s.fieldGroup}>
              <label htmlFor="region" className={s.fieldLabel}>
                Область
              </label>
              <div className={s.selectWrapper}>
                <select
                  id="region"
                  className={`${s.selectField} ${!regions.length ? s.selectDisabled : ''}`}
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  disabled={!regions.length || isLoading}
                >
                  <option value="">Виберіть область</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <div className={s.selectIcon}>📍</div>
              </div>
            </div>

            <div className={s.fieldGroup}>
              <label htmlFor="city" className={s.fieldLabel}>
                Місто
              </label>
              <div className={s.selectWrapper}>
                <select
                  id="city"
                  className={`${s.selectField} ${!selectedRegion || !cities.length ? s.selectDisabled : ''}`}
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedRegion || !cities.length || isLoading}
                >
                  <option value="">Виберіть місто</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className={s.selectIcon}>🏙️</div>
              </div>
            </div>

            <div className={s.fieldGroup}>
              <label htmlFor="department" className={s.fieldLabel}>
                Відділення
              </label>
              <div className={s.selectWrapper}>
                <select
                  id="department"
                  className={`${s.selectField} ${!selectedCity || !departments.length ? s.selectDisabled : ''}`}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  disabled={!selectedCity || !departments.length || isLoading}
                >
                  <option value="">Виберіть відділення</option>
                  {departments.map(dep => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
                <div className={s.selectIcon}>📦</div>
              </div>
            </div>
          </div>
        )}

        {selectedDepartment && (
          <div className={s.selectionComplete}>
            <div className={s.completeIcon}>✅</div>
            <p className={s.completeText}>Адреса доставки обрана</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliverySelection
