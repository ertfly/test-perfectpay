import { useState } from "react";

function App() {
  const [page, setPage] = useState(1)
  const [name, setName] = useState('')
  const submitPersonalData = (e) => {
    e.preventDefault()
    setPage(2)
  }
  const submitCheckout = (e) => {
    e.preventDefault()
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className={(page === 1 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center'}>1. Dados Pessoais</div>
        </div>
        <div className="col-md-6">
          <div className={(page === 2 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center'}>2. Formas de Pagamento</div>
        </div>
      </div>
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
                      <input type="text" className="form-control" name="name" value={name} onChange={e => setName(e.target.value)} />
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
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 text-right">
                <button type="submit" className="btn btn-primary">PROCESSAR PAGAMENTO</button>
              </div>
            </div>
          </form>
        )}
    </div>
  );
}

export default App;
