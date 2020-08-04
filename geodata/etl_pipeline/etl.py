class ETL():
    def __init__(self, in_pipe=False):
        self.in_pipe = in_pipe

    def return_or_jump(self, result):
        if self.in_pipe is True:
            return True
        else:
            return result
