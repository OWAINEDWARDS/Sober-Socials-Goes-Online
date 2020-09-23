const createColourLobby = () => {

  let lobby;

  const makeArray = () => {
    lobby = Array(20);
  }

  const getLobby = () => lobby;

  const addPlayer = (name) => {
    for(i = 0; i < lobby.length; i++){
      if(lobby[i] == null){
        lobby[i] = name;
        break;
      }
    }
    return lobby;
  }

  const isEnoughPlayers = (lobby) => {
    if(lobby.length >= 2){
      return true;
    }

    return false
  }

  makeArray();

  return{
    makeArray, getLobby, addPlayer, isEnoughPlayers
  };

}

module.exports = createColourLobby;
