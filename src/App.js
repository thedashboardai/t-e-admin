import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Button, FileCard, FileUploader, Pane, Paragraph, Select, SelectField, Switch, Tab, Tablist, Textarea, TextInputField } from 'evergreen-ui';

function App() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [mode, setmode] = React.useState(false)
  const [API, setAPI] = React.useState('')
  const [tabs] = React.useState(['Add restaurant', 'Add topic', 'Add content', 'Add quiz'])

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
          </Pane>
        ))}
      </Pane>
    </Pane>
    </div>
  );
}

const AddRestaurant = ({API}) => {
  const [value, setValue] = React.useState('')
  return (
    <div className='container'>
      <TextInputField
        id="ids-are-optional"
        label="Restaurant Name"
        required
        // description="This is a description."
        placeholder="Enter Restaurant Name"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <Button marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddTopic = ({API}) => {
  const [topicName, settopicName] = React.useState('')
  const [restaurant, setrestaurant] = React.useState('')
  const [restaurants, setRestaurants] = React.useState([]);


  const getRestaurants = async () => {
    const res = await fetch(`${API}/api/v1/getAllRestaurants`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
  }

  React.useEffect(() => {
    if(API) {
      getRestaurants()
    }
    console.log(API);
  }, [API])

  return (
    <div className='container'>
      <SelectField className='bg-white' value={restaurant} onChange={event => setrestaurant(event.target.value)} label="Select Restaurant" required>
        {restaurants?.map((r, idx) => (
        <option value={r?.value} selected={idx===0 ? true : false}>
          {r?.label}
        </option>
        ))}
      </SelectField>    
      <TextInputField
        id="ids-are-optional"
        label="Topic Name"
        required
        // description="This is a description."
        placeholder="Enter Topic Name"
        onChange={e => settopicName(e.target.value)}
        value={topicName}
      />
      <Button marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddContent = ({API}) => {
  const [title, settitle] = React.useState('')
  const [desc, setdesc] = React.useState('')
  const [fileType, setfileType] = React.useState('')
  const [topicName, settopicName] = React.useState('')
  const [restaurant, setrestaurant] = React.useState('')

  const [restaurants, setRestaurants] = React.useState([]);
  const [topics, setTopics] = React.useState([]);

  const getRestaurants = async () => {
    const res = await fetch(`${API}/api/v1/getAllRestaurants`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
  }

  const getTopics = async () => {
    const res = await fetch(`${API}/api/v1/getAllTopics`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    setTopics(data.map(r => { return { label: r?.name, value: r?.topicId } }))
  }

  React.useEffect(() => {
    if(API) {
      getRestaurants()
      getTopics()
    }
    console.log(API);
  }, [API])

  const [files, setFiles] = React.useState([])
  const [fileRejections, setFileRejections] = React.useState([])
  const handleChange = React.useCallback((files) => setFiles([files[0]]), [])
  const handleRejected = React.useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
  const handleRemove = React.useCallback(() => {
    setFiles([])
    setFileRejections([])
  }, [])


  return (
    <div className='container'>
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
        label="File Type"
        required
        // description="This is a description."
        placeholder="Enter File Type"
        onChange={e => setfileType(e.target.value)}
        value={fileType}
      />

      <Pane maxWidth={654}>
      <FileUploader
        label="Upload File"
        description="You can upload 1 file. File can be up to 50 MB."
        maxSizeInBytes={50 * 1024 ** 2}
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


      <Button marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

const AddQuiz = ({API}) => {
  const [topicName, settopicName] = React.useState('')
  const [restaurant, setrestaurant] = React.useState('')

  const [value, setValue] = React.useState('')

  const [restaurants, setRestaurants] = React.useState([]);
  const [topics, setTopics] = React.useState([]);

  const getRestaurants = async () => {
    const res = await fetch(`${API}/api/v1/getAllRestaurants`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    setRestaurants(data.map(r => { return { label: r?.name, value: r?.restaurantId } }))
  }

  const getTopics = async () => {
    const res = await fetch(`${API}/api/v1/getAllTopics`)
    const data = await res?.json()
    console.log('@@', data, '&&', data.map(r => { return { label: r?.name, value: r?.restaurantId } }));
    setTopics(data.map(r => { return { label: r?.name, value: r?.topicId } }))
  }

  React.useEffect(() => {
    if(API) {
      getRestaurants()
      getTopics()
    }
    console.log(API);
  }, [API])

  return (
    <div className='container'>
      <TextInputField
        id="ids-are-optional"
        label="Quiz"
        required
        // description="This is a description."
        placeholder="Enter Quiz"
        onChange={e => setValue(e.target.value)}
        value={value}
      />

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

      <Button marginRight={16} appearance="primary" intent="success">
        Add
      </Button>
    </div>
  )
}

export default App;
