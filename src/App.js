import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { Button, FileCard, FileUploader, Pane, Paragraph, Select, SelectField, Switch, Tab, Tablist, Textarea, TextInputField } from 'evergreen-ui';

function App() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [mode, setmode] = React.useState(false)
  const [API, setAPI] = React.useState('')
  const [tabs] = React.useState(['Add chain', 'Add restaurant', 'Add topic', 'Add content', 'Add quiz',])

  React.useEffect(() => {
    switch(mode) {
        case true:
            setAPI("https://training-and-education-prod.herokuapp.com")
            return
        case false:
          setAPI("https://train-edu-testing.herokuapp.com")
            return 
        default:
            setAPI("https://train-edu-testing.herokuapp.com")
            return
    }
  }, [mode])


  return (
    <div className="App">
      <p className='toggle'>Dev <Switch checked={mode} onChange={(e) => setmode(e.target.checked)} /> Prod</p>
      <Pane height={120}>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab}
            id={tab}
            onSelect={() => setSelectedIndex(index)}
            isSelected={index === selectedIndex}
            aria-controls={`panel-${tab}`}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      <Pane padding={16} background="tint1" flex="1">
        {tabs.map((tab, index) => (
          <Pane
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={tab}
            aria-hidden={index !== selectedIndex}
            display={index === selectedIndex ? 'block' : 'none'}
          >
            {tab==='Add restaurant' && <AddRestaurant API={API} />}
            {tab==='Add topic' && <AddTopic API={API} />}
            {tab==='Add content' && <AddContent API={API} />}
            {tab==='Add quiz' && <AddQuiz API={API} />}
            {tab==='Add chain' && <AddChain API={API} />}
          </Pane>
        ))}
      </Pane>
    </Pane>
    </div>
  );
}

const AddChain = ({API}) => {
  const [value, setValue] = React.useState('')

  const createNewChain = async () => {
    if(!value) return
    const res = await fetch(`${API}/api/v1/createNewChain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: value})
    })
    const data = await res?.json()
    console.log('@@', data);
    if(data?.isActive) {
      alert('Chain Added')
    } else if(data.status == 400) {
      alert(data.message)
    }
    // setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
  }

  return (
    <div className='container'>
      <TextInputField
        id="ids-are-optional"
        label="Chain Name"
        required
        // description="This is a description."
        placeholder="Enter Chain Name"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <Button onClick={createNewChain} marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddRestaurant = ({API}) => {
  const [value, setValue] = React.useState('')
  const [chains, setChains] = React.useState([]);
  const [chain, setChain] = React.useState('')

  const getAllChains = async () => {
    const res = await fetch(`${API}/api/v1/getAllChains`)
    const data = await res?.json()
    console.log('@@ chains', data, );
    setChains(data.map(r => { return { label: r?.name, value: r?.chain_id } }))
  }

  React.useEffect(() => {
    if(API) {
      getAllChains()
    }
    console.log(API);
  }, [API])

  const addRestaurant = async () => {
    if(!value) return

    const res = await fetch(`${API}/api/v1/addRestaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: value, chain_id: chain})
    })
    const data = await res?.json()
    console.log('@@', data.status);
    if(data?.name?.length > 0 ) {
      alert('Restaurant Added')
    } else if(data.status == 400) {
      alert(data.message)
    }
    // setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
  }

  return (
    <div className='container'>
      <SelectField className='bg-white' value={chain} onChange={event => setChain(event.target.value)} label="Select Chain" required>
        {chains?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>
      <TextInputField
        id="ids-are-optional"
        label="Restaurant Name"
        required
        // description="This is a description."
        placeholder="Enter Restaurant Name"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <Button onClick={addRestaurant} marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddTopic = ({API}) => {
  const [topicName, settopicName] = React.useState('')
  const [restaurant, setrestaurant] = React.useState('')
  const [restaurants, setRestaurants] = React.useState([]);


  const [chains, setChains] = React.useState([]);
  const [chain, setChain] = React.useState('')

  const getAllChains = async () => {
    const res = await fetch(`${API}/api/v1/getAllChains`)
    const data = await res?.json()
    console.log('@@ chains', data, );
    const newChains = data.map(r => { return { label: r?.name, value: r?.chain_id } })
    setChains(newChains)
    setChain(newChains[0].value)
    getAllRestaurantsByChain()
  }

  React.useEffect(() => {
    if(API) {
      getAllChains()
    }
    console.log(API);
  }, [API])

  const getAllRestaurantsByChain = async () => {
    const res = await fetch(`${API}/api/v1/getAllRestaurantsByChain/${chain}`)
    const data = await res?.json()
    console.log('@@ restaurants', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    // setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
    const allRestaurants = data.map(r => { return { label: r?.name, value: r?.restaurantId } })
    setRestaurants(allRestaurants)
    setrestaurant(allRestaurants[0].value)
  }

  React.useEffect(() => {
    if(API && chain) {
      getAllRestaurantsByChain()
    }
    console.log(API);
  }, [chain])

  const addAllTopicsByRestaurantId = async () => {
    if(!topicName) return
    const res = await fetch(`${API}/api/v1/addAllTopicsByRestaurantId/${restaurant}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topicName.split(','))
    })
    const data = await res?.json()
    console.log('@@ topics', data);
    if(data?.exists.length > 0) {
      alert(`Topics Already Exists: ${data.exists.join(',')}`)
    }
    if(data?.success.length > 0) {
      alert(`New Topic Added: ${data.success.join(',')}`)
    }
    // setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
  }

  return (
    <div className='container'>
      <SelectField className='bg-white' value={chain} onChange={event => setChain(event.target.value)} label="Select Chain" required>
        {chains?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>
      <SelectField className='bg-white' value={restaurant} onChange={event => setrestaurant(event.target.value)} label="Select Restaurant" required>
        {restaurants?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>    
      <TextInputField
        id="ids-are-optional"
        label="Topic Names"
        required
        // description="This is a description."
        placeholder="Enter Comma Separated Topic Names"
        onChange={e => settopicName(e.target.value)}
        value={topicName}
      />
      <Button onClick={addAllTopicsByRestaurantId} marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddContent = ({API}) => {
  const [title, settitle] = React.useState('')
  const [desc, setdesc] = React.useState('')
  const [fileTypes, setfileTypes] = React.useState([{label: 'jpg', value: 'jpg'}, {label: 'mp4', value: 'mp4'}])
  const [fileType, setfileType] = React.useState('jpg')
  const [topicName, settopicName] = React.useState('')
  const [restaurant, setrestaurant] = React.useState('')
  const [chapter, setChapter] = React.useState(0)

  const [restaurants, setRestaurants] = React.useState([]);
  const [topics, setTopics] = React.useState([]);


  const [chains, setChains] = React.useState([]);
  const [chain, setChain] = React.useState('')

  const getAllChains = async () => {
    const res = await fetch(`${API}/api/v1/getAllChains`)
    const data = await res?.json()
    console.log('@@ chains', data, );
    const newChains = data.map(r => { return { label: r?.name, value: r?.chain_id } })
    setChains(newChains)
    setChain(newChains[0].value)
    getAllRestaurantsByChain()
  }

  React.useEffect(() => {
    if(API) {
      getAllChains()
    }
    console.log(API);
  }, [API])

  const getAllRestaurantsByChain = async () => {
    const res = await fetch(`${API}/api/v1/getAllRestaurantsByChain/${chain}`)
    const data = await res?.json()
    console.log('@@ restaurants', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    const allRestaurants = data.map(r => { return { label: r?.name, value: r?.restaurantId } })
    setRestaurants(allRestaurants)
    setrestaurant(allRestaurants[0].value)
  }

  React.useEffect(() => {
    if(API && chain) {
      getAllRestaurantsByChain()
    }
    console.log(API);
  }, [chain])

  const getTopics = async () => {
    const res = await fetch(`${API}/api/v1/getAllTopics/${restaurant}`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    const allTopics = data.map(r => { return { label: r?.name, value: r?.topicId } })
    setTopics(allTopics)
    settopicName(allTopics[0].value)
  }

  React.useEffect(() => {
    if(API && restaurant) {
      getTopics()
    }
    console.log(API);
  }, [restaurant])

  const [files, setFiles] = React.useState([])
  const [fileRejections, setFileRejections] = React.useState([])
  const handleChange = React.useCallback((files) => setFiles([files[0]]), [])
  const handleRejected = React.useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
  const handleRemove = React.useCallback(() => {
    setFiles([])
    setFileRejections([])
  }, [])

  const uploadFile = async () => {

    let imageData = new FormData();
    imageData.append('file', files[0]);

    const res = await fetch(`${API}/api/v1/uploadFile?title=${title}&description=${desc}&chapter_number=${chapter}&topic_id=${topicName}&restaurant_id=${restaurant}`, {
      method: 'POST',
      body: imageData
    })
    const data = await res?.json()
    console.log('@@ upload', data);

    if(data?.isActive) {
      alert('File Added')
    } else if(data.status == 400 || data.status == 500) {
      alert(data.message)
    } else {
      alert('File Added')
    }
  }

  useEffect(() => {
    console.log(files);
  }, [files])

  return (
    <div className='container'>
      <SelectField className='bg-white' value={chain} onChange={event => setChain(event.target.value)} label="Select Chain" required>
        {chains?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>

      <SelectField className='bg-white' value={restaurant} onChange={event => setrestaurant(event.target.value)} label="Select Restaurant" required>
        {restaurants?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>

      <SelectField className='bg-white' value={topicName} onChange={event => settopicName(event.target.value)} label="Select Topic" required>
        {topics?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>

      <TextInputField
        id="ids-are-optional"
        label="Title"
        required
        // description="This is a description."
        placeholder="Enter Title"
        onChange={e => settitle(e.target.value)}
        value={title}
      />
      <Textarea
        id="ids-are-optional"
        label="Description"
        required
        // description="This is a description."
        placeholder="Enter Description"
        onChange={e => setdesc(e.target.value)}
        value={desc}
      />


      <TextInputField
        id="ids-are-optional"
        label="Chapter Number"
        required
        type={'number'}
        // description="This is a description."
        placeholder="1"
        onChange={e => setChapter(e.target.value)}
        value={chapter}
      />

      {/* <SelectField className='bg-white' value={fileType} onChange={event => setfileType(event.target.value)} label="Select File Type" required>
        {fileTypes?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField> */}

      <Pane maxWidth={654}>
      <FileUploader
        label="Upload File"
        description="You can upload 1 file. File can be up to 100 MB. Only JPG or MP4"
        maxSizeInBytes={100 * 1024 ** 2}
        maxFiles={1}
        onChange={handleChange}
        onRejected={handleRejected}
        renderFile={(file) => {
          const { name, size, type } = file
          const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
          const { message } = fileRejection || {}
          return (
            <FileCard
              key={name}
              isInvalid={fileRejection != null}
              name={name}
              onRemove={handleRemove}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
            />
          )
        }}
        values={files}
      />
    </Pane>


      <Button onClick={uploadFile} marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddQuiz = ({API}) => {
  const [topicName, settopicName] = React.useState('')
  const [restaurant, setrestaurant] = React.useState('')
  const [totalQuestions, setTotalQuestions] = React.useState(3)
  
  const [value, setValue] = React.useState('')

  const [restaurants, setRestaurants] = React.useState([]);
  const [topics, setTopics] = React.useState([]);

  const [chains, setChains] = React.useState([]);
  const [chain, setChain] = React.useState('')

  const getAllChains = async () => {
    const res = await fetch(`${API}/api/v1/getAllChains`)
    const data = await res?.json()
    console.log('@@ chains', data, );
    const newChains = data.map(r => { return { label: r?.name, value: r?.chain_id } })
    setChains(newChains)
    setChain(newChains[0].value)
    getAllRestaurantsByChain()
  }

  React.useEffect(() => {
    if(API) {
      getAllChains()
    }
    console.log(API);
  }, [API])

  const getAllRestaurantsByChain = async () => {
    const res = await fetch(`${API}/api/v1/getAllRestaurantsByChain/${chain}`)
    const data = await res?.json()
    console.log('@@ restaurants', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    const allRestaurants = data.map(r => { return { label: r?.name, value: r?.restaurantId } })
    setRestaurants(allRestaurants)
    setrestaurant(allRestaurants[0].value)
  }

  React.useEffect(() => {
    if(API && chain) {
      getAllRestaurantsByChain()
    }
    console.log(API);
  }, [chain])

  const getTopics = async () => {
    const res = await fetch(`${API}/api/v1/getAllTopics/${restaurant}`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    const allTopics = data.map(r => { return { label: r?.name, value: r?.topicId } })
    setTopics(allTopics)
    settopicName(allTopics[0].value)
  }

  React.useEffect(() => {
    if(API && restaurant) {
      getTopics()
    }
    console.log(API);
  }, [restaurant])

  const addQuizByRestTopic = async () => {
    if(!value) return

    const res = await fetch(`${API}/api/v1/addQuizByRestTopic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({restaurant_id: restaurant, topic_id: topicName, quiz_type_form_id: value, total_questions: totalQuestions})
    })
    const data = await res?.json()
    console.log('@@ topics', data);

    if(data?.status==200) {
      alert('Chain Added')
    } else if(data.status == 400) {
      alert(data.message)
    } else {
      alert(data.message)
    }
  }

  return (
    <div className='container'>
      <TextInputField
        id="ids-are-optional"
        label="Quiz"
        type="url"
        required
        // description="This is a description."
        placeholder="Enter Quiz"
        onChange={e => setValue(e.target.value)}
        value={value}
      />

      <TextInputField
        id="ids-are-optional"
        label="Total Questions"
        type="number"
        required
        // description="This is a description."
        placeholder="3"
        onChange={e => setTotalQuestions(e.target.value)}
        value={totalQuestions}
      />

      <SelectField className='bg-white' value={chain} onChange={event => setChain(event.target.value)} label="Select Chain" required>
        {chains?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>

      <SelectField className='bg-white' value={restaurant} onChange={event => setrestaurant(event.target.value)} label="Select Restaurant" required>
        {restaurants?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>

      <SelectField className='bg-white' value={topicName} onChange={event => settopicName(event.target.value)} label="Select Topic" required>
        {topics?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>

      <Button onClick={addQuizByRestTopic} marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

export default App;
