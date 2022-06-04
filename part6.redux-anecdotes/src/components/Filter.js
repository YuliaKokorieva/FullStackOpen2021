import { useDispatch } from "react-redux"
import { updateFilter } from "../reducers/filterReducer"

const Filter = () => {

  const dispatch = useDispatch()

  const handleChange = (event) => {
    const filter = event.target.value
    console.log(filter)
    dispatch(updateFilter(filter))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter