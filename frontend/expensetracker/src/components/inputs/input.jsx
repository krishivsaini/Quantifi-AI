import React,{useState} from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'
import { Link } from 'react-router-dom';
const Input = ({value, onChange, placeholder, label, type}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
  return (
    <div>
        <label className='text-[13px] text-slate-800'>{label}</label>
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                    type={type === 'password' ? showPassword ? 'text' : 'password' : type}
                    placeholder={placeholder}
                    className='input-box'
                    value={value}
                    onChange = {(e)=> onChange(e)}
                    style={type === 'password' ? { paddingRight: '2.5rem' } : {}}
                />
                {type === 'password' && (
                    <span style={{ marginLeft: '-2rem', cursor: 'pointer', zIndex: 2 }}>
                        {showPassword ? (
                            <FaRegEyeSlash size={22}
                                className='text-primary'
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEye size={22}
                                className='text-slate-400'
                                onClick={toggleShowPassword}
                            />
                        )}
                    </span>
                )}
            </div>
        </div>
    </div>
  )
}

export default Input