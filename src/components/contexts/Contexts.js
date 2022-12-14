import { UploadContext } from '../../context/UploadContext';
import { DatabaseContext } from '../../context/DatabaseContext';
import { AlbumContext } from '../../context/AlbumContext';
import { FavoritesContext } from '../../context/FavoritesContext';
import { SearchContext } from '../../context/SearchContext';
import { SettingContext } from '../../context/SettingContext';
import { AudioContext } from '../../context/AudioContext';
import { FirebaseContext } from '../../context/FirebaseContext';
import { TabsContext } from '../../context/TabsContext';
import { LoginAndSignUpContext } from '../../context/LoginAndSignUpContext';
function Contexts({children}) {
    return (
        <FirebaseContext>
        <FavoritesContext>
          <AlbumContext>
            <DatabaseContext>
              <UploadContext>
                <TabsContext>
                  <AudioContext>
                    <SearchContext>
                      <SettingContext>
                        <LoginAndSignUpContext>
                          {children}
                        </LoginAndSignUpContext>
                      </SettingContext>
                    </SearchContext>
                  </AudioContext>
                </TabsContext>
              </UploadContext>
            </DatabaseContext>
          </AlbumContext>
        </FavoritesContext>
      </FirebaseContext>
    );
}
export default Contexts;