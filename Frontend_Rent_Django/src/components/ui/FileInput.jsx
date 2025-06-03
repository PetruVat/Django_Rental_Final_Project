export default function FileInput({ multiple = false, onChange }) {
  return (
    <input
      type="file"
      accept="image/*"
      multiple={multiple}
      onChange={onChange}
      className="block w-full text-sm
                 file:mr-4 file:rounded-md file:border-0
                 file:bg-primary file:py-2 file:px-4
                 file:text-white hover:file:bg-primary/90"
    />
  );
}
