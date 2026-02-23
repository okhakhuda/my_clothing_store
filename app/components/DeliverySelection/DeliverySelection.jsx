"use client"

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
          // API Нової Пошти для отримання областей
          const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: process.env.NOVAPOST_API_KEY,
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
        } else {
          // API Укрпошти для отримання областей
          const response = await fetch('https://ukrposhta.ua/address-classifier/api/regions', {
            method: 'GET',
            headers: {
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH',
            },
          })
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

  // Завантаження міст при виборі області
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
              apiKey: '',
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
        } else {
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
              apiKey: '',
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
        } else {
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

  // Відправка даних про доставку батьківському компоненту
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

  const selectedRegionChange = e => {
    setSelectedRegion(e.target.value)
    setCities([])
    setDepartments([])
  }

  return (
    <div className={s.wrapper}>
      <h3 className={s.title}>Вибір доставки</h3>

      <div className={s.providers}>
        <label>
          <input
            type="radio"
            name="deliveryProvider"
            value="novaPoshta"
            checked={selectedProvider === 'novaPoshta'}
            onChange={() => setSelectedProvider('novaPoshta')}
          />
          Нова Пошта
        </label>

        {/* <label>
          <input
            type="radio"
            name="deliveryProvider"
            value="ukrPoshta"
            checked={selectedProvider === 'ukrPoshta'}
            onChange={() => setSelectedProvider('ukrPoshta')}
          />
          Укрпошта
        </label> */}
      </div>

      {isLoading && <p className={s.loading}>Завантаження даних...</p>}
      {error && <p className={s.error}>{error}</p>}

      <div className={s.fields}>
        <div className={s.group}>
          <label>Область:</label>
          <select value={selectedRegion} onChange={selectedRegionChange} disabled={!regions.length || isLoading}>
            <option value="">Виберіть область</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div className={s.group}>
          <label>Місто:</label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            disabled={!selectedRegion || !cities.length || isLoading}
          >
            <option value="">Виберіть місто</option>

            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className={s.group}>
          <label>Відділення:</label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            disabled={!selectedCity || !departments.length || isLoading}
          >
            <option value="">Виберіть відділення</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default DeliverySelection
