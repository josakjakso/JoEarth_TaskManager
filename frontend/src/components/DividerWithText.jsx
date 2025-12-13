export default function DividerWithText({ text }) {
    return (
        <div className="flex items-center w-2xl my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">{text}</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    );
}