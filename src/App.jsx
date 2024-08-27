import { useState, useEffect } from 'react'
import './App.css'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

let id = 0;
const generateId = () => ++id;

const records = [
  {
    id: 1,
    ad: "Sude",
    soyad: "Taştekin",
    ePosta: "sude@gmail.com",
    dogumTarihi: "2002-07-26"
  },
  {
    id: 2,
    ad: "Arda",
    soyad: "Toraman",
    ePosta: "arda@gmail.com",
    dogumTarihi: "2004-04-01"
  },
  {
    id: 3,
    ad: "Sıla",
    soyad: "Kara",
    ePosta: "sila@gmail.com",
    dogumTarihi: "2003-09-08"
  },
  {
    id: 4,
    ad: "Ezel",
    soyad: "Çakın",
    ePosta: "ezel@gmail.com",
    dogumTarihi: "2002-08-07"
  },
];
function App() {
  const [data, setData] = useState([]);

  function appendStudent(ad, soyad, ePosta, dogumTarihi) {
    const dataObj = {
      id: generateId(),
      ad,
      soyad,
      ePosta,
      dogumTarihi
    }
    setData([...data, dataObj]);
  }

  useEffect(() => {
    // if(!localStorage.data) {
    //   localStorage.data = JSON.stringify(records);
    // } 
    // veriler geldi ondan sildik
    setData(JSON.parse(localStorage.data));
  }, []);

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

  return (
    <div className='container'>
      <h1>Öğrenci bilgi sistemi <AddStudent appendStudent={appendStudent} /></h1>
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
    </div>
  )
}

function AddStudent({ appendStudent }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    appendStudent(e.target['ad'].value, e.target['soyad'].value, e.target['ePosta'].value, e.target['dogumTarihi'].value);
    e.target.reset();
    handleClose();
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        yeni
      </Button>
      <Dialog className='dialog' open={open} onClose={handleClose}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <input name='ad' required type="text" placeholder='Ad' />
            <input name='soyad' required type="text" placeholder='Soyad' />
            <input name='ePosta' required type="email" placeholder='E-posta' />
            <input name='dogumTarihi' required type="date" placeholder='Doğum Tarihi' />
            <button type="submit">Ekle</button>
            <button type="button" onClick={handleClose}>İptal</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
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