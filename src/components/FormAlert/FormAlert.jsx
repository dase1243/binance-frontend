export default function FormAlert({formAlert}) {
    if (formAlert.status) {
        return (
            <div className="alert alert-danger text-break text-center" role="alert">
                {formAlert.message}
            </div>
        )
    } else {
        return (
            <></>
        )
    }
}