import { useForm } from 'react-hook-form';
import '../Styles/AddGymForm.css';
const AddGymForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log('Gym Data:', data);
    alert('Gym added successfully!');
    reset(); // Clear form
  };

  return (
    <div className="forms">
      <h1>form for adding gym data</h1><br/><br/>
      
      <form onSubmit={handleSubmit(onSubmit)} className="gym-form">
        <div className="form-group">
          <label>Gym Name:</label><br/>
          <input
            {...register('gymName', { 
              required: 'Gym name is required',
              minLength: { value: 2, message: 'At least 2 characters' }
            })}
            placeholder="Fitness Hub Gym"
          />
          {errors.gymName && <p className="error">{errors.gymName.message}</p>}
        </div><br/>

        <div className="form-group">
          <label>Phone Number:</label><br/>
          <input
            type="tel"
            {...register('phone', { 
              required: 'Phone is required',
              pattern: { value: /^[0-9]{10}$/, message: '10-digit number only' }
            })}
            placeholder="1234567890"
          />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div><br/>

        <div className="form-group">
          <label>Address:</label><br/>
          <textarea
            {...register('address', { 
              required: 'Address is required',
              minLength: { value: 10, message: 'At least 10 characters' }
            })}
            rows="3"
            placeholder="123 Main St, City, State"
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div><br/>

        <div className="form-group">
          <label>Established Year:</label><br/>
          <input
            type="number"
            {...register('year', { 
              required: 'Year is required',
              min: { value: 1900, message: 'After 1900' },
              max: { value: 2025, message: 'Before 2026' }
            })}
            placeholder="2020"
          />
          {errors.year && <p className="error">{errors.year.message}</p>}
        </div><br/>

        <div className="form-group">
          <label>Monthly Fee (₹):</label><br/>
          <input
            type="number"
            {...register('fee', { 
              required: 'Fee is required',
              min: { value: 500, message: 'Minimum ₹500' }
            })}
            placeholder="2500"
          />
          {errors.fee && <p className="error">{errors.fee.message}</p>}
        </div><br/>

        <div className="buttons">
          <button type="submit" className="submit-btn">Add Gym</button>
          <button type="button" onClick={() => reset()} className="reset-btn">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default AddGymForm;
