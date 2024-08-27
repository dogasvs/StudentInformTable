import { useState, useEffect } from 'react'
import './App.css'


const records = [
  {
    id: 1,
    ad: "Orhan",
    soyad: "Ekici",
    ePosta: "orhanekici@gmail.com",
    dogumTarihi: "1989-03-17"
  },
  {
    id: 2,
    ad: "Doğa",
    soyad: "Savaş",
    ePosta: "arda@gmail.com",
    dogumTarihi: "2004-04-01"
  },
  {
    id: 3,
    ad: "Melek",
    soyad: "Dal",
    ePosta: "melekdal@gmail.com",
    dogumTarihi: "2000-09-12"
  },
  {
    id: 4,
    ad: "Sema",
    soyad: "Bekdemir",
    ePosta: "semabekdemir@gmail.com",
    dogumTarihi: "1999-02-10"
  },
];

function App() {
  const [data, setData] = useState([]);
  const [DialogOpen, setDialogOpen] = useState(false);

  function showDialog() {   
    setDialogOpen(true);
   
  }

  function closeDialog() { 
    setDialogOpen(false);
  }

  // useEffect(() => {
  //   // if(!localStorage.data) {
  //   //   localStorage.data = JSON.stringify(records);
  //   // } 
  //   // veriler geldi ondan sildik
  //   setData(JSON.parse(localStorage.data));
  // }, []);

  function save() {
    localStorage.data = JSON.stringify(data);
  }

  function updateRecord(record) {
    let foundRecord = data.find(x => x.id === record.id);
    // referansı bozmamak için object assign kullanıyoruz
    // eğer referansı kırarsak bu sefer gösterim sırası bozulur
    // eğer bu notları çözemezseniz referansı kırıp arayüzde probleme odaklanın
    Object.assign(foundRecord, record);
    setData([...data]);
    save();
  }

  function deleteRecord(id) {
    if(!confirm('Emin misiniz?')) { return; }

    setData(data.filter(x => x.id !== id));
    save();
  }

  function appendStudent(record) {
    setData([...data, { id: data.length + 1, ...record }]); //sema abladan aldım öğrenciyi dataya ekliyoruz
    closeDialog(); 
  }

  return (
    <div className='container'>
      <h1>Öğrenci bilgi sistemi <button onClick={showDialog}>Yeni</button> </h1>
      <div className="studentTable">
        <ul className="studentTableTitles">
          <li>Ad</li>
          <li>Soyad</li>
          <li>E-Posta Adresi</li>
          <li>Doğum Tarihi</li>
          <li>#</li>
        </ul>
        {data.map(x => <StudentRow key={x.id} {...x} deleteRecord={deleteRecord} updateRecord={updateRecord} />)}
      </div>
      {DialogOpen && (
        <AddStudent
          OpenModal={DialogOpen}
          appendStudent={appendStudent}
          closeDialog={closeDialog}
        />
      )}
    </div>
  )
}

function AddStudent({ OpenModal, appendStudent, closeDialog }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    appendStudent(formObj);
  }

  return (
    <dialog className="modal" open={OpenModal}>
    <form className="formModal" method="dialog" autoComplete="off" onSubmit={handleSubmit}>
      <input required type="text" name="ad" placeholder="isim" />
      <input required type="text" name="soyad" placeholder="Soyisim" />
      <input required type="email" name="ePosta" placeholder="e-Posta" />
      <input required type="date" name="dogumTarihi" placeholder="Doğum Tarihi" />
      <button className="modelAddNew" type="submit">Ekle</button>
      <button className="exit" type="button"
        onClick={closeDialog}> Vazgeç</button>
    </form>
  </dialog>
);
}

function StudentRow({ id, ad, soyad, ePosta, dogumTarihi, updateRecord, deleteRecord }) {
  const [isEditing, setEditing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = id;
    updateRecord(formObj);
    setEditing(false);
  }

  return (
    <form onSubmit={handleSubmit} onDoubleClick={() => setEditing(true)}>
      {isEditing ? 
        <>
          <div className="studentTableCol">
            <input type="text" required name='ad' defaultValue={ad} />
          </div>
          <div className="studentTableCol">
            <input type="text" required name='soyad' defaultValue={soyad} />
          </div>
          <div className="studentTableCol">
            <input type="email" required name='ePosta' defaultValue={ePosta} />
          </div>
          <div className="studentTableCol">
            <input type="date" required name='dogumTarihi' defaultValue={dogumTarihi} />
          </div>
          <div className="studentTableCol">
            <button type='button' onClick={() => setEditing(false)}>vazgeç</button>
            <button className='saveBtn' type='submit'>kaydet</button>
          </div>
        </>
        :
        <>
          <div className="studentTableCol">{ad}</div>
          <div className="studentTableCol">{soyad}</div>
          <div className="studentTableCol">{ePosta}</div>
          <div className="studentTableCol">{dogumTarihi.split('-').reverse().join('.')}</div>
          <div className="studentTableCol">
            <button type='button' onClick={() => setEditing(true)}>düzenle</button>
            <button className='delBtn' type='button' onClick={() => deleteRecord(id)}>sil</button>
          </div>
        </>
      }
    </form> 
  )
}

export default App