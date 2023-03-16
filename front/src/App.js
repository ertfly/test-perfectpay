import { useState } from "react";
import Loader from "./Loader";
import axios from 'axios'

async function Request(method, url, data, success, error, loader) {
  if (typeof (data) == 'undefined')
    data = {}
  if (typeof (success) != 'function')
    success = () => { }
  if (typeof (error) != 'function')
    error = () => { }

  let urlRequest = process.env.REACT_APP_API_HOST + '/' + url
  console.log(urlRequest)

  axios({
    method: method,
    url: urlRequest,
    data: data,
  }).then((res) => {
    if (typeof (res.data.response) !== 'object' || typeof (res.data.data) === 'undefined') {
      error('Resposta do servidor inválida')
      return
    }

    let response = res.data.response
    let data = res.data.data

    if (typeof (response.code) !== 'number') {
      error('Resposta do servidor inválida')
      return
    }

    if (response.code !== 0) {
      error(response.msg)
      return;
    }

    success(data)
  })
}

function App() {
  const [page, setPage] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('');
  const [payment, setPayment] = useState(0)
  const submitPersonalData = (e) => {
    e.preventDefault()
    setLoader(true)
    window.setTimeout(() => {
      setLoader(false)
      setPage(2)
    }, 1000)

  }
  const submitCheckout = async (e) => {
    e.preventDefault()
    Request('GET', 'orders', null, (res) => {

    }, (err) => {
      setError(err)
      window.setTimeout(_=>{
        setError('')
      },3000)
    })
  }
  const [loader, setLoader] = useState(false)

  return (
    <>
      <Loader show={loader} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className={(page === 1 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center rounded-pill'}>1. Dados Pessoais</div>
          </div>
          <div className="col-md-6">
            <div className={(page === 2 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center rounded-pill'}>2. Formas de Pagamento</div>
          </div>
        </div>
        {error ? <div className="alert alert-danger mt-3 rounded-pill">{error}</div> : <></>}
        {page === 1 ?
          (<form onSubmit={submitPersonalData}>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">PREENCHA SEUS DADOS PESSOAIS</div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="col-md-4">
                        <label>Nome Completo:</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label>E-mail:</label>
                        <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 text-right">
                <button type="submit" className="btn btn-primary">CONTINUAR</button>
              </div>
            </div>
          </form>) : (
            <form onSubmit={submitCheckout}>
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">ESCOLHA SUA FORMA DE PAGAMENTO</div>
                    <div className="card-body">
                      <div className="form-row">
                        <div className="col-md-6">
                          <span className={'btn btn-light btn-block border py-4 text-center ' + (payment === 1 ? 'bg-primary text-white' : 'text-dark')} onClick={_ => setPayment(1)}>
                            <i className="fas fa-credit-card fa-5x"></i><br />
                            <b className="d-inline-block mt-3">CARTÃO DE CRÉDITO</b>
                          </span>
                        </div>
                        <div className="col-md-6">
                          <span className={'btn btn-light btn-block border py-4 text-center ' + (payment === 2 ? 'bg-primary text-white' : 'text-dark')} onClick={_ => setPayment(2)}>
                            <i className="fas fa-barcode fa-5x"></i><br />
                            <b className="d-inline-block mt-3">BOLETO</b>
                          </span>
                        </div>
                      </div>
                      {payment === 1 ? (
                        <div className="form-row mt-3">
                          <div className="col-md-4">
                            <label>Número do Cartão</label>

                          </div>
                        </div>) : (payment === 2 ? (<>
                        </>) : (<></>))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12 text-right">
                  <span className="btn btn-warning mr-3" onClick={_ => setPage(1)}>VOLTAR</span>
                  <button type="submit" className="btn btn-primary">PROCESSAR PAGAMENTO</button>
                </div>
              </div>
            </form>
          )}
      </div>
    </>
  );
}

export default App;
