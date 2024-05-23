function Throbber() {
  return (
    <div className="w-24 h-24 bg-primary fixed top-2/4 left-2/4 translate-y-[-50%] translate-x-[-50%] rounded-full animate-pulse">
      <div className="w-14 h-14 bg-background fixed top-2/4 left-2/4 translate-y-[-50%] translate-x-[-50%] rounded-full"></div>
    </div>
  );
}

export default Throbber;
