import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const componentsValues = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    fetchedData: {},
    displayStatus: componentsValues.initial,
  }

  componentDidMount() {
    this.fetchDataApi()
  }

  fetchDataApi = async () => {
    this.setState({displayStatus: componentsValues.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const convertedData = {
          last7DaysVaccination: data.last_7_days_vaccination,
          vaccinationByAge: data.vaccination_by_age,
          vaccinationByGender: data.vaccination_by_gender,
        }
        this.setState({
          fetchedData: convertedData,
          displayStatus: componentsValues.success,
        })
      } else {
        this.setState({displayStatus: componentsValues.failure})
      }
    } catch (error) {
      this.setState({displayStatus: componentsValues.failure})
    }
  }

  renderCharts = () => {
    const {fetchedData} = this.state
    const {last7DaysVaccination, vaccinationByGender, vaccinationByAge} =
      fetchedData
    return (
      <>
        <VaccinationCoverage VaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  )

  switchCaseCheck = () => {
    const {displayStatus} = this.state
    switch (displayStatus) {
      case componentsValues.success:
        return this.renderCharts()
      case componentsValues.pending:
        return this.loadingView()
      case componentsValues.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-logo-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p className="logo-text">Co-WIN</p>
        </div>
        <h1 className="page-heading">CoWIN Vaccination in India</h1>
        <div className="charts-container">{this.switchCaseCheck()}</div>
      </div>
    )
  }
}

export default CowinDashboard
