import axios from 'axios'

const url = 'https://shopofly.herokuapp.com/api'

export const login = (email, password) => {
  return axios({
    method: 'POST',
    url: `${url}/auth/login`,
    headers: { 'Content-type': 'application/json' },
    data: {
      "email": email,
      "password": password
    }
  })
  .then((res) => res.data.access_token)
}

export const register = (email, password) => {
  return axios({
    method: 'POST',
    url: `${url}/users/register`,
    headers: { 'Content-type': 'application/json' },
    data: {
      "email": email,
      "password": password,
    }
  })
  .then((res) => res.data)

}

export const getUserInfo = (token) => {
  return axios({
    method: 'POST',
    url: `${url}/auth/me`,
    headers: { 'Content-type': 'application/json' },
    data: {
      'token': token
    }
  })
  .then((res) => res.data)
}

const logout = () => {
  // TODO implement this.
}

export const getItem = (itemId) => {
  //TODO wait for Nawaf to change API request
  return axios({
    method: 'GET',
    url: `${url}/store/item/${itemId}`,
    headers: { 'Content-type': 'application/json' }
  })
  .then((res) => res.data)
}
