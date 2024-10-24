function Button({title,onClickFunction})
{
    return <button onClick={()=>{onClickFunction()}}>{title}</button>
}

export default Button