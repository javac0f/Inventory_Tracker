/*
page.js is the main entryway into our app
*/

'use client'
import Image from "next/image";
import {useState, useEffect} from 'react' //clientside functions
import {firestore} from '@/firebase'
import {Box, Typography, Stack, Button, Modal, TextField, style} from '@mui/material'
import{collection, doc, query, getDocs, setDoc, deleteDoc, getDoc} from 'firebase/firestore'

export default function Home() {

  //HELPER FUNCTIONS
  const[inventory, setInventory] = useState([])
  const[open, setOpen] = useState(false)
  const[itemName, setItemName] = useState('')


  //FUNCTION: INVENTORY UPDATE/FETCHING
  const updateInventory = async() =>{ //async won't freeze page when loading code
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    docs.forEach((doc)=>{
      inventoryList.push({name:doc.id, ...doc.data()})
    })
    setInventory(inventoryList)
  }

  const addItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity:1})
    }
    await updateInventory()
  }


  //FUNCTION: REMOVE ITEMS
  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  
  //USE EFFECT
  useEffect(()=>{ //function runs update based upon dependency array
    updateInventory()
  },[])   //empty dependency array means only update once (at the beginning once the page loads)



  //FUNCTIONS: MODAL CONTROL
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  //MAIN FUNCTION
  return(
    <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
    bgcolor={'#333333'}
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" bgcolor = {'#ADD8E6'}>
          Add Item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={1}>
          <TextField
            id="Outlined"
            label="ITEM"
            variant="outlined"
            sx={{
              // Root class for the input field
              "& .MuiOutlinedInput-root": {
                color: "#ADD8E6",
                // Class for the border around the input field
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ADD8E6",
                  borderWidth: "1px",
                },
              },
              // Class for the label of the input field
              "& .MuiInputLabel-outlined": {
                color: "#ADD8E6",
              },
            }}
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            style = {{backgroundColor:'#ADD8E6'}}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="contained" onClick={handleOpen} style = {{backgroundColor: '#ADD8E6', color: '#FFFFFF'}} >
      Add New Item
    </Button>
    <Box border={'10px solid #333333'}>
      <Box
        width="800px"
        height="200px"
        bgcolor={'#333333'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h1'} color={'#ADD8E6'} textAlign={'center'}>
          INVENTORY
        </Typography>
      </Box>
      <Stack width="800px" height="400px" spacing={2} overflow={'auto'}>
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#333333'}
            paddingX={5}
          >
            <Typography variant={'h3'} color={'#ADD8E6'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h3'} color={'#ADD8E6'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)} style = {{backgroundColor: 'red', color: '#FFFFFF'}}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
  )
}
